import cytoscape, {Core} from "cytoscape";
import React, {useState} from "react";
// @ts-ignore
import dagre from 'cytoscape-dagre';
import {GraphControlPanel} from "./GraphControlPanel";
import styles from "./Graph.module.css";
import CytoscapeComponent from "react-cytoscapejs";
import {graphStyle, layoutOptions} from "./CytoscapeInitProperties";
import {useAppSelector} from "../../app/hooks";
import {graphDataSelector} from "./graphDataSlice";

cytoscape.use(dagre)

export function Graph() {
    const graphData = useAppSelector(graphDataSelector);
    const [cy, setCy] = useState<Core | null>(null);
    return (<div id={styles.graphFlexboxContainer}>
        <CytoscapeComponent elements={graphData.elements} style={{width: "80%", height: 1000}}
                            stylesheet={graphStyle} layout={layoutOptions} cy={(cy) => {
            setCy(cy);
            (window as any).cy = cy; // for debugging purpose
        }} userZoomingEnabled={false}/>
        {cy !== null && <GraphControlPanel cy={cy}/>}
    </div>);
}
