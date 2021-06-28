import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {ElementDefinition} from "cytoscape";
import * as graphlibDot from "graphlib-dot";
import {BaseGraphData} from "./BaseGraphData";

interface GraphDataState {
    elements: ElementDefinition[],
    simultaneousNodes: Array<Array<string>>
    selectedSimultaneousNodes: Array<Array<string>>
    isSimulLabelChecked: boolean
}

export function generateGraphDataList(): ElementDefinition[] {
    const graph = graphlibDot.read(BaseGraphData);
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

const initialState: GraphDataState = {
    elements: generateGraphDataList(),
    simultaneousNodes: [["deliver bill", "deliver poster", "deliver flyer"], ["print bill", "print poster", "deliver poster"]],
    selectedSimultaneousNodes: [["deliver bill", "deliver poster", "deliver flyer"]],
    isSimulLabelChecked: true
};

export const graphDataSlice = createSlice({
    name: "graphProperty",
    initialState,
    reducers: {
        setGraphElements: (state, action: PayloadAction<ElementDefinition[]>) => {
            state.elements = action.payload;
        },
        setSelectedSimultaneousNodes: (state, action: PayloadAction<Array<Array<string>>>) => {
            state.selectedSimultaneousNodes = action.payload;
        },
        setIsSimulLabelChecked: (state, action: PayloadAction<boolean>) => {
            state.isSimulLabelChecked = action.payload;
        }
    }
});
export const reduxActions = graphDataSlice.actions
export const graphDataSelector = (state: RootState) => state.graphData;
export default graphDataSlice.reducer;
