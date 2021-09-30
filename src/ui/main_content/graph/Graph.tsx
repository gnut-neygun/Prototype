import cytoscape, {Core} from "cytoscape";
import React, {useEffect, useState} from "react";
// @ts-ignore
import dagre from 'cytoscape-dagre';
import {GraphControlPanel} from "./GraphControlPanel";
import styles from "./Graph.module.css";
import CytoscapeComponent from "react-cytoscapejs";
import {defaultGraphStyle} from "./GraphDefaultStyle";
import coseBilkent from 'cytoscape-cose-bilkent';
import composeLayout from "../../../layout/composeLayout";

import klay from 'cytoscape-klay';
import {graphDataSelector} from "../../../shared/graphDataSlice";
import {useAppSelector} from "../../../shared/hooks";
import {bubbleSetInstances, cytoscapeRef} from "../../../shared/globalVariables";
import {store} from "../../../shared/store";


cytoscape.use(dagre)
cytoscape.use(coseBilkent);
cytoscape.use(klay);

export function Graph() {
    const graphData = graphDataSelector(store.getState()) //Optimization, if we use useSelector it renders too much
    const graphViewData = useAppSelector(state => state.graphData, (oldState, newState) => {
        return oldState.choosenSource === newState.choosenSource;
    })
    const [cy, setCy] = useState<Core | null>(null);
    useEffect(() => {
        cytoscapeRef.cy?.edges().toggleClass("hasLabel", true);
    }, [graphViewData.choosenSource])
    return (<div id={styles.graphFlexboxContainer}>
        <CytoscapeComponent elements={graphData.elements} style={{width: "80%", height: 1000}}
                            stylesheet={defaultGraphStyle} layout={graphData.layout} cy={(cy) => {
            setCy(cy);
            (window as any).cy = cy; // for debugging purpose
            cytoscapeRef.cy = cy;
            bubbleSetInstances.clear();
            composeLayout();
            if (graphViewData.isSetViewChecked)
                bubbleSetInstances.refreshBubbleset(graphData.selectedSimultaneousNodes);
        }} userZoomingEnabled={false}/>
        {cy !== null && <GraphControlPanel cy={cy}/>}
    </div>);
}