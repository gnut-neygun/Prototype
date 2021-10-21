/**
 * Take in a graphviz string in dot language and output ElementDefinition Array for cytoscape
 * @param inputData Graphviz string in dot language
 */
import {ElementDefinition} from "cytoscape";
import * as graphlibDot from "graphlib-dot";

export function generateGraphDataList(inputData: string): ElementDefinition[] {
    const graph = graphlibDot.read(inputData);
    const subgraphs = graph.children();
    const generatedElementList: ElementDefinition[] = [];
    for (const subgraph of subgraphs) {
        //each subgraph correspond to a cluster of nodes that belongs to a process
        generatedElementList.push({data: {id: subgraph}})
        const nodes = graph.children(subgraph);
        nodes.forEach(node => {
            const myNode = {
                data: {id: node, parent: subgraph}
            }
            generatedElementList.push(myNode);
            const outEdges = graph.outEdges(node);
            if (typeof outEdges === "undefined") {
                return;
            }
            for (const edge of outEdges) {
                generatedElementList.push({
                    data: {id: `${edge.v}-${edge.w}`, source: node, target: edge.w, label: graph.edge(edge).label}
                })
            }
        });
    }
    return generatedElementList;
}

export type GraphGenerationInput = {
    name: string,
    content: string,
    startActivities: string[],
    endActivities: string[],
}
export function generateGraph(inputData: GraphGenerationInput[]): ElementDefinition[] {
    const generatedElementList: ElementDefinition[] = [];
    for (let input of inputData) {
        //Generate a cluster for each file.
        const startName= `start_${input.name}`
        const endName = `end_${input.name}`
        generatedElementList.push({data: {id: input.name}})
        generatedElementList.push({data: {id: startName, parent: input.name}})
        generatedElementList.push({data: {id: endName, parent: input.name}})
        const dfgMatrix = JSON.parse(input.content)
        for (let activity of Object.keys(dfgMatrix)) {
            const myNode = {
                data: {id: activity, parent: input.name}
            }
            generatedElementList.push(myNode);
            for (let outVertex of Object.keys(dfgMatrix[activity])) {
                if (outVertex===activity)
                    continue;
                generatedElementList.push({
                    data: {id: `${activity}-${outVertex}`, source: activity, target: outVertex, label: dfgMatrix[activity][outVertex]}
                })
            }
        }
        for (let startActivitiy of input.startActivities) {
            generatedElementList.push({
                data: {id: `${startName}-${startActivitiy}`, source: startName, target: startActivitiy}
            })
        }
        for (let endActivitiy of input.endActivities) {
            generatedElementList.push({
                data: {id: `${endActivitiy}-${endName}`, source: endActivitiy, target: endName}
            })
        }
    }
    return generatedElementList;
}
