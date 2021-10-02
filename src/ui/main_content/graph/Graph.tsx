import cytoscape from "cytoscape";
import React, {useEffect} from "react";
// @ts-ignore
import dagre from 'cytoscape-dagre';
import {GraphControlPanel} from "./GraphControlPanel";
import styles from "./Graph.module.css";
import {defaultGraphStyle} from "./GraphDefaultStyle";
import coseBilkent from 'cytoscape-cose-bilkent';

import klay from 'cytoscape-klay';
import {graphDataSelector} from "../../../shared/graphDataSlice";
import {useAppSelector} from "../../../shared/hooks";
import {bubbleSetInstances, cytoscapeRef} from "../../../shared/globalVariables";
import {store} from "../../../shared/store";
import {observer} from "mobx-react-lite";


cytoscape.use(dagre)
cytoscape.use(coseBilkent);
cytoscape.use(klay);

export const Graph = observer(() =>{
    const graphData = graphDataSelector(store.getState()) //Optimization, if we use useSelector it renders too much
    const graphViewData = useAppSelector(state => state.graphData, (oldState, newState) => {
        return oldState.choosenSource === newState.choosenSource;
    })
    useEffect(() => {
        const cy= cytoscape({
            container: document.getElementById('cytoscape-container'),
            elements: graphData.elements,
            style: defaultGraphStyle,
            layout: graphData.layout
        })
        cytoscapeRef.cy = cy;
        (window as any).cy = cy;
        bubbleSetInstances.clear();
        cytoscapeRef.cy?.edges().toggleClass("hasLabel", true);
        if (graphViewData.isSetViewChecked)
            bubbleSetInstances.refreshBubbleset(graphData.selectedSimultaneousNodes);
    }, [graphViewData.choosenSource])
    return <div id={styles.graphFlexboxContainer}>
        <div id="cytoscape-container" style={{width: "80%", height: 1000}}></div>
        {cytoscapeRef.cy !== null && <GraphControlPanel cy={cytoscapeRef.cy}/>}
    </div>;
})
