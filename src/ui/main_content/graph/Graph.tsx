import cytoscape from "cytoscape";
import React, {useEffect} from "react";
// @ts-ignore
import dagre from 'cytoscape-dagre';
import {GraphControlPanel} from "./GraphControlPanel";
import coseBilkent from 'cytoscape-cose-bilkent';

import klay from 'cytoscape-klay';
import {observer} from "mobx-react-lite";
import {datasourceStore} from "../../../shared/store/DatasourceStore";
import {autorun} from "mobx";
import {CircularProgress} from "@mui/material";
import styled from "@emotion/styled";

cytoscape.use(dagre)
cytoscape.use(coseBilkent);
cytoscape.use(klay);

const GraphContainer = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: row;
`
const CenterCircularProgress = styled(CircularProgress)`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-right: -200px;
`
export const Graph = observer(() =>{
    useEffect(() => autorun(()=>{
        const graphStore = datasourceStore.currentFileStore.graphDataStore;
        const cy= graphStore.initializeCytoscape(document.getElementById("cytoscape-container")!!)
        graphStore.clearBubbleSet();
        cy.edges().toggleClass("hasLabel", true);
        if (graphStore.isSetViewChecked)
            graphStore.refreshBubbleSet();
    }), [])
    return <GraphContainer>
        {datasourceStore.currentFileStore.graphDataStore.isLoading && <CenterCircularProgress size={200}/>}
        <div id="cytoscape-container" style={{width: "80%", height: "100vh"}}></div>
        {datasourceStore.currentFileStore.graphDataStore.cytoscapeReference !== null && <GraphControlPanel/>}
    </GraphContainer>;
})
