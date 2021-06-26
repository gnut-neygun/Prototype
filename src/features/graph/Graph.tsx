import cytoscape, {ElementDefinition} from "cytoscape";
import React, {useEffect} from "react";
import {BaseGraphData} from "./BaseGraphData";
import * as graphlibDot from "graphlib-dot";
// @ts-ignore
import dagre from 'cytoscape-dagre';
import {GraphControlPanel} from "./GraphControlPanel";
import styles from "./Graph.module.css";
import {useAppSelector} from "../../app/hooks";
import {graphPropertySelector} from "./graphPropertySlice";


export function Graph() {
    const graphPropery = useAppSelector(graphPropertySelector);
    useEffect(() => {
        const graphData = generateGraphDataList();
        cytoscape.use(dagre)
        const myCytoscape = cytoscape({

            container: document.getElementById('graph-container'),

            elements: graphData,

            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#362F33',
                        'label': 'data(id)'
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#436130',
                        'target-arrow-color': '#436130',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'edge-distances': 'intersection',
                        'target-endpoint': 'outside-to-line-or-label' //avoid intersecting with node label
                    }
                }
            ],
        });
        (window as any).cy = myCytoscape // for debugging purpose
        const layoutOptions = {
            name: 'dagre',
            nodeSep: graphPropery.nodeSpacing
        };
        myCytoscape.layout(layoutOptions).run()
        myCytoscape.userZoomingEnabled(false);
    });
    return (<div id={styles.graphFlexboxContainer}>
        <div id={"graph-container"} style={{width: "80%", height: 1000}}/>
        <GraphControlPanel/>
    </div>);
}


export function generateGraphDataList(): ElementDefinition[] {

    const graph = graphlibDot.read(BaseGraphData);
    const subgraphs = graph.children();
    const generatedElementList: ElementDefinition[] = [];
    for (const subgraph of subgraphs) {
        const nodes = graph.children(subgraph);
        nodes.forEach(node => {
            const myNode = {
                data: {id: node}
            }
            generatedElementList.push(myNode);
            const outEdges = graph.outEdges(node);
            if (typeof outEdges === "undefined") {
                return;
            }
            for (const edge of outEdges) {
                generatedElementList.push({
                    data: {id: `${edge.v}-${edge.w}`, source: node, target: edge.w}
                })
            }
        });
    }
    return generatedElementList;
}
