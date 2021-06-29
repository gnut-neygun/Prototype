import {Checkbox, FormControlLabel, Typography} from "@material-ui/core";
import SimulCheckList from "./SimulCheckList";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {graphDataSelector, reduxActions} from "../graphDataSlice";

export function SimultaneousPanel() {
    const graphData = useAppSelector(graphDataSelector);
    const dispatch = useAppDispatch();
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
