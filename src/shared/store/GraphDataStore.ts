import {action, IReactionDisposer, makeObservable, observable, reaction, runInAction,} from "mobx";
import {FileStore} from "./FileStore";
import cytoscape, {Core, ElementDefinition, LayoutOptions} from "cytoscape";
import {layoutOptions} from "../../ui/main_content/graph/layout/defaultLayout";
import {defaultGraphStyle} from "../../ui/main_content/graph/GraphDefaultStyle";
import {BubbleSetPath, BubbleSetsPlugin} from "cytoscape-bubblesets";
import {generateGraph} from "../GraphGenerators";
import {datasourceStore} from "./DatasourceStore";

export class GraphDataStore {
    @observable
    layout: LayoutOptions = layoutOptions;
    @observable
    elements: ElementDefinition[] = []
    @observable
    isSimulLabelChecked: boolean = true;
    @observable
    selectedSimultaneousNodes : string[][]=[]
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

    private cytoscapeContainer: HTMLElement | null = null;
    private readonly disposer: IReactionDisposer;
    constructor(public fileStore: FileStore) {
        makeObservable(this);
        this.disposer=reaction(() => [fileStore.contentList] as const, () => {
            if (fileStore.contentList.length===0)
                return;
            this.setElements(generateGraph(this.fileStore.contentList));
            if (window.location.pathname==="/" && this.cytoscapeContainer !== null)
                this.initializeCytoscape(this.cytoscapeContainer);
            this.isLoading = false; //It will be set to true in file store.
        })
    }

    @action
    public setElements(elements: ElementDefinition[]) {
        this.elements = elements;
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
        return this.cytoscapeReference;
    }

    @action
    setLayout(layoutOptions: LayoutOptions) {
        this.layout = layoutOptions;
        this.cytoscapeReference?.layout(layoutOptions).run();
    }
}