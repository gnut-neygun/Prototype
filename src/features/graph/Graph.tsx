import cytoscape, {Core} from "cytoscape";
import React, {useEffect, useState} from "react";
// @ts-ignore
import dagre from 'cytoscape-dagre';
import {GraphControlPanel} from "./GraphControlPanel";
import styles from "./Graph.module.css";
import CytoscapeComponent from "react-cytoscapejs";
import {defaultGraphStyle} from "./GraphDefaultStyle";
import {useAppSelector} from "../../app/hooks";
import {graphDataSelector} from "../../app/graphDataSlice";
import {bubbleSetInstances, cytoscapeRef} from "../../app/globalVariables";
import coseBilkent from 'cytoscape-cose-bilkent';
import composeLayout from "../../layout/composeLayout";
import {store} from "../../app/store";


cytoscape.use(dagre)
cytoscape.use(coseBilkent);

export function Graph() {
    const graphData = graphDataSelector(store.getState()) //Optimization, if we use useSelector it renders too much
    const graphViewData = useAppSelector(state => state.graphData, (oldState, newState) => {
        return oldState.choosenSource === newState.choosenSource;
    })
    const [cy, setCy] = useState<Core | null>(null);
    useEffect(() => {
        cytoscapeRef.cy?.edges().toggleClass("hasLabel", true);
    }, [])
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
