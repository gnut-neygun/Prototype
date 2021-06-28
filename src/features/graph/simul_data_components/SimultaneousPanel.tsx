import {Checkbox, FormControlLabel, Typography} from "@material-ui/core";
import SimulCheckList from "./SimulCheckList";
import React, {useContext, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {graphDataSelector, reduxActions} from "../graphDataSlice";
import {CytoscapeContext} from "../GraphControlPanel";

export function SimultaneousPanel() {
    const graphData = useAppSelector(graphDataSelector);
    const cy = useContext(CytoscapeContext);
    const dispatch = useAppDispatch();
    useEffect(() => {
        reduxActions.setIsSimulLabelChecked(true)
    }, []);
    return <div>
        <FormControlLabel
            control={
                <Checkbox
                    checked={graphData.isSimulLabelChecked}
                    onChange={() => {
                        dispatch(reduxActions.setIsSimulLabelChecked(!graphData.isSimulLabelChecked))
                    }}
                    name="simulLabelCheckbox"
                    color="primary"
                />
            }
            label="Show frequency label"
        />
        <Typography variant={"h5"}>Simultaneous nodes</Typography>
        <SimulCheckList/>
    </div>
}
