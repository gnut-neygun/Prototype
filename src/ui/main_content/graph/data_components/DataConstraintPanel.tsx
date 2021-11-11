import {observer} from "mobx-react-lite";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent
} from "@mui/material";
import {datasourceStore} from "../../../../shared/store/DatasourceStore";
import {action} from "mobx";
import React from "react";
import {PairType} from "../../../../shared/store/RegularityKPIStore";

export const DataConstraintPanel = observer(() => {
    return <>
        <FormControl fullWidth size="small">
            <InputLabel id="pair-type-label">Pair type</InputLabel>
            <Select
                id="pair-type-select"
                value={datasourceStore.currentFileStore.dataKPIStore.currentPairType}
                label="Pair type"
                onChange={(event: SelectChangeEvent<PairType>) => {
                    datasourceStore.currentFileStore.dataKPIStore.setCurrentPairType(event.target.value as unknown as PairType)
                }}
            >
                <MenuItem value={PairType.START_START}>Start-Start (Directly follow event)</MenuItem>
                <MenuItem value={PairType.START_COMPLETE}>Start-Complete</MenuItem>
            </Select>
        </FormControl>
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