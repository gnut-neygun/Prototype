import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk, RootState} from "./store";
import {ElementDefinition, LayoutOptions} from "cytoscape";
import * as graphlibDot from "graphlib-dot";
import {PrinterGraphData} from "./PrinterGraphData";
import {cytoscapeRef} from "./globalVariables";
import ManufacturingGraphData from "./ManufacturingGraphData";
import {layoutOptions} from "../layout/defaultLayout";

interface DataSource {
    name: string
    inputFiles: FileList | null
    elements: ElementDefinition[]
    simultaneousNodes: Array<Array<string>>
    selectedSimultaneousNodes: Array<Array<string>>
    layout: LayoutOptions
}

interface GraphDataState {
    dataSource: Array<DataSource>
    choosenSource: string
    isSimulLabelChecked: boolean
    isSetViewChecked: boolean
}

/**
 * Take in a graphviz string in dot language and output ElementDefinition Array for cytoscape
 * @param inputData Graphviz string in dot language
 */
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
        inputFiles: null,
        elements: generateGraphDataList(PrinterGraphData),
        layout: layoutOptions,
        simultaneousNodes: [["deliver bill", "deliver poster", "deliver flyer"], ["print bill", "print poster", "deliver poster"]],
        selectedSimultaneousNodes: [["deliver bill", "deliver poster", "deliver flyer"]],
    },
        {
            name: "manufacturing",
            inputFiles: null,
            elements: generateGraphDataList(ManufacturingGraphData),
            layout: layoutOptions,
            simultaneousNodes: [],
            selectedSimultaneousNodes: [],
        }],
    choosenSource: "printer",
    isSimulLabelChecked: true,
    isSetViewChecked: true
};

export const graphDataSlice = createSlice({
    name: "graphProperty",
    initialState,
    reducers: {
        setSelectedSimultaneousNodes: (state, action: PayloadAction<Array<Array<string>>>) => {
            const currentSource = state.dataSource.filter(e => e.name === state.choosenSource)[0]
            currentSource.selectedSimultaneousNodes = action.payload;
        },
        setIsSimulLabelChecked: (state, action: PayloadAction<boolean>) => {
            state.isSimulLabelChecked = action.payload;
        },
        setLayout: (state, action: PayloadAction<LayoutOptions>) => {
            const currentSource = state.dataSource.filter(e => e.name === state.choosenSource)[0]
            currentSource.layout = action.payload;
        },
        setChoosenSource: (state, action: PayloadAction<string>) => {
            state.choosenSource = action.payload;
        },
        addDataSource: (state, action: PayloadAction<DataSource | string>) => {
            if (typeof action.payload === "string") {
                //empty data soruce with just its name
                state.dataSource.push({
                    name: action.payload,
                    inputFiles: null,
                    elements: [],
                    simultaneousNodes: [],
                    selectedSimultaneousNodes: [],
                    layout: layoutOptions
                });
            } else {
                state.dataSource.push(action.payload);
            }
        },
        setBubbleSetView: (state, action: PayloadAction<boolean>) => {
            state.isSetViewChecked = action.payload;
        },
        setFiles: (state, action: PayloadAction<{ source: string, files: FileList | null }>) => {
            state.dataSource.filter(source => source.name === action.payload.source)[0].inputFiles = action.payload.files
        }
    }
});
export const reduxActions = graphDataSlice.actions
export const graphDataSelector = (state: RootState) => state.graphData.dataSource.filter(e => e.name === state.graphData.choosenSource)[0];
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
