import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk, RootState} from "./store";
import {ElementDefinition, LayoutOptions} from "cytoscape";
import * as graphlibDot from "graphlib-dot";
import {BaseGraphData} from "./BaseGraphData";
import {layoutOptions} from "../features/graph/CytoscapeInitProperties";
import {cytoscapeRef} from "./globalVariables";
import ManufacturingGraphData from "./ManufacturingGraphData";

interface DataSource {
    name: string
    elements: ElementDefinition[]
}

interface GraphDataState {
    dataSource: Array<DataSource>
    choosenSource: string
    layoutOptions: LayoutOptions
    simultaneousNodes: Array<Array<string>>
    selectedSimultaneousNodes: Array<Array<string>>
    isSimulLabelChecked: boolean
    isSetViewChecked: boolean
}

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

const initialState: GraphDataState = {
    dataSource: [{
        name: "printer",
        elements: generateGraphDataList(BaseGraphData)
    },
        {
            name: "manufacturing",
            elements: generateGraphDataList(ManufacturingGraphData)
        }],
    choosenSource: "printer",
    layoutOptions: layoutOptions,
    simultaneousNodes: [["deliver bill", "deliver poster", "deliver flyer"], ["print bill", "print poster", "deliver poster"]],
    selectedSimultaneousNodes: [["deliver bill", "deliver poster", "deliver flyer"]],
    isSimulLabelChecked: true,
    isSetViewChecked: true
};

export const graphDataSlice = createSlice({
    name: "graphProperty",
    initialState,
    reducers: {
        setSelectedSimultaneousNodes: (state, action: PayloadAction<Array<Array<string>>>) => {
            state.selectedSimultaneousNodes = action.payload;
        },
        setIsSimulLabelChecked: (state, action: PayloadAction<boolean>) => {
            state.isSimulLabelChecked = action.payload;
        },
        setLayout: (state, action: PayloadAction<LayoutOptions>) => {
            state.layoutOptions = action.payload;
        },
        setChoosenSource: (state, action: PayloadAction<string>) => {
            state.choosenSource = action.payload;
        },
        addDataSource: (state, action: PayloadAction<DataSource>) => {
            state.dataSource.push(action.payload);
        },
        setBubbleSetView: (state, action: PayloadAction<boolean>) => {
            state.isSetViewChecked = action.payload;
        }
    }
});
export const reduxActions = graphDataSlice.actions
export const graphDataSelector = (state: RootState) => state.graphData;
export default graphDataSlice.reducer;

export function setSimulAction(isChecked: boolean): AppThunk {
    return (dispatch) => {
        cytoscapeRef.cy?.edges().toggleClass("hasLabel", isChecked);
        dispatch(reduxActions.setIsSimulLabelChecked(isChecked))
    };
}


export function setLayout(layoutOptions: LayoutOptions): AppThunk {
    return (dispatch) => {
        dispatch(reduxActions.setLayout(layoutOptions))
        cytoscapeRef.cy?.layout(layoutOptions).run();
    };
}
