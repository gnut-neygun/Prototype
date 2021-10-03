import {Checkbox, Divider, FormControlLabel, Typography} from "@mui/material";
import SimulCheckList from "./SimulCheckList";
import React from "react";
import {observer} from "mobx-react-lite";
import {datasourceStore} from "../../../../shared/store/DatasourceStore";

export const SimultaneousPanel = observer(() => {
    const graphStore = datasourceStore.currentFileStore.graphDataStore;
    return <div>
        <FormControlLabel
            control={
                <Checkbox
                    checked={graphStore.isSimulLabelChecked}
                    onChange={graphStore.toggleFrequencyLabel.bind(graphStore)}
                    name="simulLabelCheckbox"
                    color="primary"
                />
            }
            label="Show frequency label"
        />
        <Divider/>
        <Typography variant={"button"}>Simultaneous nodes</Typography>
        <SimulCheckList/>
    </div>;
});
