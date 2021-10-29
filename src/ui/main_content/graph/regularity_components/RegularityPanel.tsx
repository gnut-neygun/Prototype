import {observer} from "mobx-react-lite";
import {
    Box,
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
    SelectChangeEvent,
    Slider,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {datasourceStore} from "../../../../shared/store/DatasourceStore";
import {action} from "mobx";
import {PairType} from "../../../../shared/store/RegularityKPIStore";
import React, {useState} from "react";

export const RegularityPanel = observer(() => {
    const [relRegularity, setRelRegularity] = useState<number>(datasourceStore.currentFileStore.regularityKPIStore.relativeEventOccurence ?? 0.95)
    return <>
        <FormControl fullWidth size="small">
            <InputLabel id="pair-type-label">Pair type</InputLabel>
            <Select
                id="pair-type-select"
                value={datasourceStore.currentFileStore.regularityKPIStore.currentPairType}
                label="Pair type"
                onChange={action((event: SelectChangeEvent<PairType>) => {
                    datasourceStore.currentFileStore.regularityKPIStore.currentPairType = event.target.value as PairType
                })}
            >
                <MenuItem value={PairType.START_START}>Start-Start (Directly follow event)</MenuItem>
                <MenuItem value={PairType.START_COMPLETE}>Start-Complete</MenuItem>
                <MenuItem value={PairType.BEGIN_END}>Begin-End</MenuItem>
            </Select>
        </FormControl>
        <Typography sx={{marginTop: "5px"}}>Relative occurence</Typography>
        <Box sx={{width: 200}}>
            <Stack spacing={2} direction="row" sx={{mb: 1}} alignItems="center">
                <Slider aria-label="Volume"
                        value={relRegularity}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(event, newValue) => setRelRegularity(newValue as number)}
                        onMouseUp={action(() => {
                            datasourceStore.currentFileStore.regularityKPIStore.relativeEventOccurence = relRegularity;
                        })}
                        valueLabelDisplay={"off"}
                />
                <Typography>{relRegularity}</Typography>
            </Stack>
        </Box>
        <TextField
            id="outlined-number"
            label="Time Delta in Seconds"
            type="number"
            size="small"
            defaultValue={datasourceStore.currentFileStore.regularityKPIStore.timeDeltaInMilis / 1000}
            onChange={action((event) => {
                datasourceStore.currentFileStore.regularityKPIStore.timeDeltaInMilis = parseInt(event.target.value) * 1000;
            })}
            InputLabelProps={{
                shrink: true,
            }}></TextField>
        <List dense={true}>
            {Object.entries(datasourceStore.currentFileStore.regularityKPIStore.currentConstraint ?? {}).map(entry =>
                <ListItem key={entry[0]}>
                    <ListItemText
                        primary={entry[0]}
                        secondary={`${entry[1]}`}
                    />
                </ListItem>)}
        </List>
        <FormGroup>
            <FormControlLabel control={<Checkbox
                checked={datasourceStore.currentFileStore.graphDataStore.isDisplayRegularityEdges}
                onChange={action(() => {
                    datasourceStore.currentFileStore.graphDataStore.toggleRegularityEdge()
                })}/>} label="Display edges"/>
        </FormGroup>
    </>
});