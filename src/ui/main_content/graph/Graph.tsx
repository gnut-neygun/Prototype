import cytoscape from "cytoscape";
import React, {useEffect} from "react";
// @ts-ignore
import dagre from 'cytoscape-dagre';
import {GraphControlPanel} from "./GraphControlPanel";
import styles from "./Graph.module.css";
import coseBilkent from 'cytoscape-cose-bilkent';

import klay from 'cytoscape-klay';
import {observer} from "mobx-react-lite";
import {datasourceStore} from "../../../shared/store/DatasourceStore";
import {autorun} from "mobx";


cytoscape.use(dagre)
cytoscape.use(coseBilkent);
cytoscape.use(klay);

export const Graph = observer(() =>{
    useEffect(() => autorun(()=>{
        const graphStore = datasourceStore.currentFileStore.graphDataStore;
        const cy= graphStore.getCytoscapeReference(document.getElementById("cytoscape-container")!!)
        graphStore.clearBubbleSet();
        cy.edges().toggleClass("hasLabel", true);
        if (graphStore.isSetViewChecked)
            graphStore.refreshBubbleSet();
    }), [])
    return <div id={styles.graphFlexboxContainer}>
        <div id="cytoscape-container" style={{width: "80%", height: 1000}}></div>
        {datasourceStore.currentFileStore.graphDataStore.cytoscapeReference !== null && <GraphControlPanel/>}
    </div>;
})
