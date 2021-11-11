import {action, IReactionDisposer, makeObservable, observable, reaction, runInAction,} from "mobx";
import {FileStore} from "./FileStore";
import cytoscape, {
    Collection,
    Core,
    EdgeCollection,
    EdgeSingular,
    ElementDefinition,
    LayoutOptions,
    NodeCollection,
    NodeSingular
} from "cytoscape";
import {layoutOptions} from "../../ui/main_content/graph/layout/defaultLayout";
import {defaultGraphStyle} from "../../ui/main_content/graph/GraphDefaultStyle";
import {BubbleSetPath, BubbleSetsPlugin} from "cytoscape-bubblesets";
import {generateGraph} from "../GraphGenerators";
import {datasourceStore} from "./DatasourceStore";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export class GraphDataStore {
    @observable
    layout: LayoutOptions = layoutOptions;
    @observable
    elements: ElementDefinition[] = []
    @observable
    isSimulLabelChecked: boolean = true;
    @observable
    selectedSimultaneousNodes: string[][] = []
    @observable
    cytoscapeReference: Core | null = null;
    @observable
    isSetChecked: boolean = true;
    @observable
    bubbleSetInstances: Array<BubbleSetPath> = [];
    @observable
    bubbleSetPluginInstance: BubbleSetsPlugin | null = null;
    @observable
    isLoading: boolean = false;
    @observable
    isDisplayRegularityEdges: boolean = false
    @observable
    isDisplayDataConstraint: boolean = false
    private regEdgeCollection: Collection & EdgeCollection & NodeCollection & EdgeSingular & NodeSingular
    private cytoscapeContainer: HTMLElement | null = null;
    private readonly disposer: IReactionDisposer;
    public pendingTasks: Array<CallableFunction> = [];

    constructor(public fileStore: FileStore) {
        makeObservable(this);
        this.disposer = reaction(() => [fileStore.contentList] as const, () => {
            if (fileStore.contentList.length === 0)
                return;
            this.setElements(generateGraph(this.fileStore.contentList));
            if (window.location.pathname === "/" && this.cytoscapeContainer !== null)
                this.initializeCytoscape(this.cytoscapeContainer);
            this.isLoading = false; //It will be set to true in file store.
        })
    }

    @action
    public setElements(elements: ElementDefinition[]) {
        this.elements = elements;
    }

    @action
    public toggleRegularityEdge() {
        this.isDisplayRegularityEdges = !this.isDisplayRegularityEdges;
        const cy = this.cytoscapeReference!!
        if (this.isDisplayRegularityEdges) {
            //Add edges to the graph that corresponds to the isc constraint.
            const regConstraint = datasourceStore.currentFileStore.regularityKPIStore.currentConstraint ?? {};
            this.regEdgeCollection = cy.collection();
            for (let [key, value] of Object.entries(regConstraint)) {
                const pair = key.split(",")
                if (value) {
                    const addedElement = cy.add({
                        group: 'edges',
                        data: {
                            id: `${pair[0]}-${pair[1]}-reg`, source: pair[0], target: pair[1]
                        }
                    });
                    this.regEdgeCollection = this.regEdgeCollection.union(addedElement)
                }
            }
            this.regEdgeCollection.style({
                "line-color": 'red',
                "line-dash-pattern": [1, 1],
                "target-arrow-color": 'red'
            })
        } else {
            cy.remove(this.regEdgeCollection);
        }
    }

    /**
     * Also update tooltip accordingly
     */
    @action
    public toggleDataConstraintEdge() {
        this.isDisplayDataConstraint = !this.isDisplayDataConstraint;
        const cy = this.cytoscapeReference!!
        const entries = Object.entries(datasourceStore.currentFileStore.dataKPIStore.constraint);
        if (this.isDisplayDataConstraint) {
            for (const entry of entries) {
                const edgePair = entry[0].split(",");
                let edgePairInString = edgePair.join("-");
                let edgeEle = cy.$id(edgePairInString);
                if (edgeEle.empty()) {
                    edgePairInString += "-data"
                    edgeEle = cy.add({
                        group: 'edges',
                        data: {
                            id: `${edgePairInString}`, source: edgePair[0], target: edgePair[1]
                        }
                    });
                }
                //Set tool tip for this element
                // @ts-ignore
                let ref = edgeEle.popperRef()
                let dummyDomEle = document.createElement('div');
                const tippyInstance = tippy(dummyDomEle, { // tippy props:
                    getReferenceClientRect: ref.getBoundingClientRect, // https://atomiks.github.io/tippyjs/v6/all-props/#getreferenceclientrect
                    trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
                    placement: 'right-end',
                    allowHTML: true,
                    arrow: true,
                    content: JSON.stringify(entry[1]),
                });
                edgeEle.data("tippy", tippyInstance)
                edgeEle.on('mouseover', function (event) {
                    const node = event.target;
                    const tippy = node.data("tippy");
                    tippy.show();
                });
                edgeEle.on('mouseout', function (event) {
                    const node = event.target;
                    const tippy = node.data("tippy");
                    tippy.hide();
                });
                edgeEle.style({
                    "line-color": "blue",
                    "line-style": "dotted"
                })
            }
        } else {
            for (const entry of entries) {
                const edgePair = entry[0].split(",");
                const edgePairInString = edgePair.join("-");
                const edgeEle = cy.$id(edgePairInString);
                if (edgeEle.empty()) {
                    const addedElement = cy.$id(edgePairInString + "-data")
                    cy.remove(addedElement);
                } else {
                    edgeEle.removeStyle("line-color")
                    edgeEle.removeStyle("line-style");
                }
            }
        }
    }

    @action
    setIsLoading(isLoad: boolean) {
        this.isLoading = isLoad;
    }

    public changeZoomLevel(value: number) {
        this.cytoscapeReference?.zoom(value);
    }

    public getZoomLevel(): number{
        return Number(this.cytoscapeReference?.zoom().toFixed(2));
    }

    public zoomFit() {
        this.cytoscapeReference?.fit();
        this.cytoscapeReference?.center();
    }

    @action
    public toggleFrequencyLabel() {
        this.isSimulLabelChecked = !this.isSimulLabelChecked;
        this.cytoscapeReference?.edges()?.toggleClass('hasLabel', this.isSimulLabelChecked);
    }

    @action
    public clearBubbleSet() {
        this.bubbleSetInstances.length = 0;
        this.bubbleSetPluginInstance?.destroy();
    }

    @action
    public refreshBubbleSet(): void {
        this.clearBubbleSet();
        if (this.cytoscapeReference === null)
            return;
        else {
            this.cytoscapeReference.ready(() => {
                runInAction(() => {
                    const cy = this.cytoscapeReference!!;
                    this.bubbleSetPluginInstance = new BubbleSetsPlugin(cy);
                    for (const [index, simulCluster] of this.selectedSimultaneousNodes.entries()) {
                        const myNodeCollection = simulCluster.reduce((accumulator, nodeId) => accumulator.union(cy.$id(nodeId)), cy.collection())

                        this.bubbleSetInstances.push(this.bubbleSetPluginInstance.addPath(myNodeCollection, null, cy.nodes().diff(myNodeCollection).left, {
                            virtualEdges: true,
                            // @ts-ignore
                            style: {
                                fill: 'rgba(70, 130, 180, 0.2)',
                                stroke: datasourceStore.currentFileStore.simulKPIStore.getColorFor(simulCluster),
                                // @ts-ignore
                                "stroke-width": 2
                            },
                        }))
                    }
                });
            });
        }
    }

    @action
    public setSelectedSimultaneousNodes(data: string[][]) {
        this.selectedSimultaneousNodes = data;
        this.refreshBubbleSet();
    }

    @action
    public addSimultaneousNode(cluster: string[]) {
        this.selectedSimultaneousNodes.push(cluster);
        // //adding a correspond set of edge to the graph
        // //creat a cycle from start to end.
        // debugger;
        // for (let i = 0; i < data.length; i++) {
        //     const source = data[0];
        //     //Only circle to itself when it is the only node
        //     if (i==0 && (data.length !=1 || this.isSetChecked))
        //         continue;
        //     const target = data[i+1] ?? data[0]; //circle back to start when its the last node
        //     const addedElement= this.cytoscapeReference?.add({
        //         group: 'edges',
        //         data: {
        //             id: `${source}-${target}`, source: source, target: target
        //         }
        //     })
        //     this.simulColorMap.pushIntoKey(data, addedElement);
        // }
        //Change color accordingly.
        const cy = this.cytoscapeReference !!
        const simulKPIStore= datasourceStore.currentFileStore.simulKPIStore
        for (let node of cluster) {
            const selectedNode = cy.$id(node)
            selectedNode.style("background-color", simulKPIStore.getColorFor(cluster))
        }
        this.refreshBubbleSet();
    }

    @action
    removeSimultaneousNode(cluster: string[]) {
        const foundNode = this.selectedSimultaneousNodes.find(node => node.length === cluster.length && node.every(value => cluster.indexOf(value) !== -1));
        if (foundNode !== undefined) {
            this.selectedSimultaneousNodes.splice(this.selectedSimultaneousNodes.indexOf(foundNode), 1);
        }
        // const addedNode=this.simulColorMap.get(key)
        // //can happen if bubble set is checked
        // if (addedNode===undefined)
        //     return;
        // addedNode?.forEach(node => this.cytoscapeReference?.remove(node))
        // this.simulColorMap.delete(key);
        // // console.log(this.selectedSimultaneousNodes);
        const cy = this.cytoscapeReference !!
        for (let node of cluster) {
            const selectedNode = cy.$id(node)
            selectedNode.removeStyle("background-color")
        }
        this.refreshBubbleSet();
    }

     hasSimultaneousNode(key: string[]) : boolean{
        return this.selectedSimultaneousNodes.filter(node =>
            node.length===key.length && node.every(value => key.indexOf(value)!==-1)
        ).length>0
    }

    @action
    initializeCytoscape(container: HTMLElement) {
        this.cytoscapeContainer = container;
        if (this.cytoscapeReference!==null)
            this.cytoscapeReference.destroy();
        this.cytoscapeReference= cytoscape({
            container: container,
            elements: this.elements,
            style: defaultGraphStyle,
            layout: this.layout
        })
        // @ts-ignore
        window.cy = this.cytoscapeReference
        this.cytoscapeReference.center();
        this.cytoscapeReference?.edges()?.toggleClass('hasLabel', this.isSimulLabelChecked);
        this.cytoscapeReference.userZoomingEnabled(false);
        this.setSelectedSimultaneousNodes([]) //This also refreshes bublbleset
        const cy = this.cytoscapeReference;
        cy.nodes().forEach(node => {
            // @ts-ignore
            let ref = node.popperRef()
            let dummyDomEle = document.createElement('div');
            const tippyInstance = tippy(dummyDomEle, { // tippy props:
                getReferenceClientRect: ref.getBoundingClientRect, // https://atomiks.github.io/tippyjs/v6/all-props/#getreferenceclientrect
                trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
                placement: 'right-end',
                allowHTML: true,
                arrow: true,
                content: "",
            });
            node.data("tippy", tippyInstance)
        });
        cy.on('mouseover', 'node', function (event) {
            const node = event.target;
            const tippy = node.data("tippy");
            tippy.show();
        });
        cy.on('mouseout', 'node', function (event) {
            const node = event.target;
            const tippy = node.data("tippy");
            tippy.hide();
        });
        for (let task of this.pendingTasks) {
            task();
        }
        return this.cytoscapeReference;
    }

    public setElementTooltip(id: string, content: string) {
        const tippy = this.cytoscapeReference!!.$id(id).data("tippy");
        tippy.setContent(content)
    }

    @action
    setLayout(layoutOptions: LayoutOptions) {
        this.layout = layoutOptions;
        this.cytoscapeReference?.layout(layoutOptions).run();
    }
}