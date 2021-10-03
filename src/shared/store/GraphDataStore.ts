import {action, makeObservable, observable, runInAction,} from "mobx";
import {FileStore} from "./FileStore";
import cytoscape, {Core, ElementDefinition, LayoutOptions} from "cytoscape";
import {layoutOptions} from "../../layout/defaultLayout";
import {defaultGraphStyle} from "../../ui/main_content/graph/GraphDefaultStyle";
import {BubbleSetPath, BubbleSetsPlugin} from "cytoscape-bubblesets";
import {generateRandomColor} from "../../utilities/colorGenerator";

export class GraphDataStore {
    @observable
    layout: LayoutOptions = layoutOptions;
    @observable
    elements: ElementDefinition[] = []
    @observable
    isSimulLabelChecked: boolean = true;
    @observable
    isSetViewChecked: boolean = true;
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

    constructor(public fileStore: FileStore) {
        makeObservable(this);
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
                    const randomColors = generateRandomColor(this.selectedSimultaneousNodes.length);
                    for (const [index, simulCluster] of this.selectedSimultaneousNodes.entries()) {
                        const myNodeCollection = simulCluster.reduce((accumulator, nodeId) => accumulator.union(cy.$id(nodeId)), cy.collection())

                        this.bubbleSetInstances.push(this.bubbleSetPluginInstance.addPath(myNodeCollection, null, cy.nodes().diff(myNodeCollection).left, {
                            virtualEdges: true,
                            // @ts-ignore
                            style: {
                                fill: 'rgba(70, 130, 180, 0.2)',
                                stroke: randomColors[index],
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
    public addSimultaneousNode(data: string[]) {
        this.selectedSimultaneousNodes.push(data);
        this.refreshBubbleSet();
    }

    @action
    removeSimultaneousNode(key: string[]) {
        const foundNode = this.selectedSimultaneousNodes.find(node => node.length === key.length && node.every(value => key.indexOf(value) !== -1));
        if (foundNode !== undefined) {
            this.selectedSimultaneousNodes.splice(this.selectedSimultaneousNodes.indexOf(foundNode), 1);
        }
        this.refreshBubbleSet();
    }

     hasSimultaneousNode(key: string[]) : boolean{
        return this.selectedSimultaneousNodes.filter(node =>
            node.length===key.length && node.every(value => key.indexOf(value)!==-1)
        ).length>0
    }

    @action
    getCytoscapeReference(container: HTMLElement) {
        if (this.cytoscapeReference!==null)
            this.cytoscapeReference.destroy();
        this.cytoscapeReference= cytoscape({
            container: container,
            elements: this.elements,
            style: defaultGraphStyle,
            layout: this.layout
        })
        return this.cytoscapeReference;
    }
}