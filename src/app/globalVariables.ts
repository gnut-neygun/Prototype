import {Core} from "cytoscape";
import {BubbleSetPath, BubbleSetsPlugin} from "cytoscape-bubblesets";
import {generateRandomColor} from "../Utilities";

interface MyBubbleSetArray extends Array<BubbleSetPath> {
    bb?: BubbleSetsPlugin//store a reference for cleaning purpose
    clear(): void

    refreshBubbleset(data: string[][]): void
}

export const cytoscapeRef: { cy: Core | null } = {cy: null}

const bubbleSetInstances: MyBubbleSetArray = [] as unknown as MyBubbleSetArray;

bubbleSetInstances.clear = function () {
    for (const instance of this) {
        instance.remove();
    }
    if (this.bb !== undefined)
        this.bb.destroy();
};

bubbleSetInstances.refreshBubbleset = function (data) {
    bubbleSetInstances.clear();
    const cy = cytoscapeRef.cy;
    if (cy === null)
        return;
    cy.ready(() => {
        this.bb = new BubbleSetsPlugin(cy);
        const randomColors = generateRandomColor(data.length);
        for (const [index, simulCluster] of data.entries()) {
            const myNodeCollection = simulCluster.reduce((accumulator, nodeId) => accumulator.union(cy.$id(nodeId)), cy.collection())

            bubbleSetInstances.push(this.bb.addPath(myNodeCollection, null, cy.nodes().diff(myNodeCollection).left, {
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

};
export {bubbleSetInstances}
