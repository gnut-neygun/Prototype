import {Checkbox, Divider, FormControlLabel, Typography} from "@material-ui/core";
import SimulCheckList from "./SimulCheckList";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {setSimulAction} from "../../../app/graphDataSlice";

export function SimultaneousPanel() {
    const isSimulChecked = useAppSelector(state => state.graphData.isSimulLabelChecked);
    const dispatch = useAppDispatch();
    return <div>
        <FormControlLabel
            control={
                <Checkbox
                    checked={isSimulChecked}
                    onChange={() => {
                        dispatch(setSimulAction(!isSimulChecked))
                    }}
                    name="simulLabelCheckbox"
                    color="primary"
                />
            }
            label="Show frequency label"
        />
        <Divider/>
        <Typography variant={"button"}>Simultaneous nodes</Typography>
        <SimulCheckList/>
    </div>
}
