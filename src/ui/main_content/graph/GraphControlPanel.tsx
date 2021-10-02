import {Button, Checkbox, Divider, FormControlLabel} from "@mui/material";
import React, {useEffect} from "react";
import {Core} from "cytoscape";
import {ISCPanel} from "./ISCPanel";
import {LayoutMenu} from "../../../layout/LayoutMenu";
import ZoomSlider from "./ZoomSlider";
import {useAppDispatch, useAppSelector} from "../../../shared/hooks";
import {graphDataSelector, reduxActions} from "../../../shared/graphDataSlice";
import {bubbleSetInstances} from "../../../shared/globalVariables";


export const CytoscapeContext = React.createContext<Core>({} as Core);


export function GraphControlPanel({cy}: { cy: Core }) {
    const graphProperty = useAppSelector(graphDataSelector);
    const isSetChecked = useAppSelector(state => state.graphData.isSetViewChecked)
    const dispatch = useAppDispatch();

    const handleBubbleSetCheckbox = () => {
        if (isSetChecked) {
            //the condition is inverted because this indicate changes in checkbox state
            bubbleSetInstances.clear();
        } else bubbleSetInstances.refreshBubbleset(graphProperty.selectedSimultaneousNodes)
        dispatch(reduxActions.setBubbleSetView(!isSetChecked));
    };
    useEffect(() => {
        if (isSetChecked)
            bubbleSetInstances.refreshBubbleset(graphProperty.selectedSimultaneousNodes)
        else {
            bubbleSetInstances.clear();
        }
    }, [JSON.stringify(graphProperty.selectedSimultaneousNodes)]);

    const handleZoomFit = () => {
        cy.fit();
        cy.center();
    }

    return (
        <CytoscapeContext.Provider value={cy}>
            <div id="graph-control-panel" style={{width: "20%"}}>
                <LayoutMenu/>
                <Divider/>
                <ZoomSlider/>
                <Button variant={"text"} style={{margin: "10px"}} onClick={handleZoomFit}>Zoom fit and center</Button>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isSetChecked}
                            onChange={handleBubbleSetCheckbox}
                            name="bubbleSetCheckbox"
                            color="primary"
                        />
                    }
                    label="Bubble set view"
                />
                <ISCPanel/>
            </div>
        </CytoscapeContext.Provider>

    );
}
