import {observer} from "mobx-react-lite";
import {Checkbox, FormControlLabel, FormGroup, List, ListItem, ListItemText} from "@mui/material";
import {datasourceStore} from "../../../../shared/store/DatasourceStore";
import {action} from "mobx";
import React from "react";

export const DataConstraintPanel = observer(() => {
    return <>
        <List dense={true}>
            {Object.entries(datasourceStore.currentFileStore.dataKPIStore.constraint ?? {}).map(entry =>
                <ListItem key={entry[0]}>
                    <ListItemText
                        primary={entry[0]}
                        secondary={`${entry[1]}`}
                    />
                </ListItem>)}
        </List>
        <FormGroup>
            <FormControlLabel control={<Checkbox
                checked={datasourceStore.currentFileStore.graphDataStore.isDisplayDataConstraint}
                onChange={action(() => {
                    datasourceStore.currentFileStore.graphDataStore.toggleDataConstraintEdge();
                })}/>} label="Display edges"/>
        </FormGroup>
    </>
});