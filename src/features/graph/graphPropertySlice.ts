import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

interface GraphPropertyState {
    nodeSpacing: number
}

const initialState: GraphPropertyState = {
    nodeSpacing: 200
}

export const graphPropertySlice = createSlice({
    name: "graphProperty",
    initialState,
    reducers: {
        setNodeSpacing: (state, action: PayloadAction<number>) => {
            state.nodeSpacing = action.payload;
        }
    }
});
export const {setNodeSpacing} = graphPropertySlice.actions
export const graphPropertySelector = (state: RootState) => state.graphProperty;
export default graphPropertySlice.reducer;
