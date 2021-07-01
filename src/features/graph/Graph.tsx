import cytoscape, {Core} from "cytoscape";
import React, {useEffect, useState} from "react";
// @ts-ignore
import dagre from 'cytoscape-dagre';
import {GraphControlPanel} from "./GraphControlPanel";
import styles from "./Graph.module.css";
import CytoscapeComponent from "react-cytoscapejs";
import {graphStyle, layoutOptions} from "./CytoscapeInitProperties";
import {useAppSelector} from "../../app/hooks";
import {graphDataSelector} from "../../app/graphDataSlice";
import assert from "assert";
import {bubbleSetInstances, cytoscapeRef} from "../../app/globalVariables";
import coseBilkent from 'cytoscape-cose-bilkent';


cytoscape.use(dagre)
cytoscape.use(coseBilkent);

export function Graph() {
    const graphData = useAppSelector(graphDataSelector, (oldState, newState) => {
        return oldState.choosenSource === newState.choosenSource;
    });
    const [cy, setCy] = useState<Core | null>(null);
    const choosenSource = graphData.dataSource.filter(source => source.name === graphData.choosenSource)
    assert(choosenSource.length === 1);
    //The following effect initalizes everything in cy after the first render
    useEffect(() => {
        cytoscapeRef.cy?.edges().toggleClass("hasLabel", true);
    }, []);
    return (<div id={styles.graphFlexboxContainer}>
        <CytoscapeComponent elements={choosenSource[0].elements} style={{width: "80%", height: 1000}}
                            stylesheet={graphStyle} layout={layoutOptions} cy={(cy) => {
            setCy(cy);
            (window as any).cy = cy; // for debugging purpose
            cytoscapeRef.cy = cy;
            cy.layout(layoutOptions).run();
            bubbleSetInstances.clear();
            if (graphData.isSetViewChecked)
                bubbleSetInstances.refreshBubbleset(graphData.selectedSimultaneousNodes);
        }} userZoomingEnabled={false}/>
        {cy !== null && <GraphControlPanel cy={cy}/>}
    </div>);
}
