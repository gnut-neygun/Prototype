import {Box, Checkbox, Divider, FormControlLabel, Slider, Stack, TextField, Typography} from "@mui/material";
import SimulCheckList from "./SimulCheckList";
import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import {datasourceStore} from "../../../../shared/store/DatasourceStore";
import {action} from "mobx";

export const SimultaneousPanel = observer(() => {
    const graphStore = datasourceStore.currentFileStore.graphDataStore;
    const simulKPIStore = datasourceStore.currentFileStore.simulKPIStore
    const [rel, setRel] = useState<number>(simulKPIStore.relativeEventOccurence)
    return <div>
        <Typography sx={{marginTop: "5px"}}>Relative occurence</Typography>
        <Box sx={{width: 200}}>
            <Stack spacing={2} direction="row" sx={{mb: 1}} alignItems="center">
                <Slider aria-label="Volume"
                        value={rel}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(event, newValue) => setRel(newValue as number)}
                        onMouseUp={action(() => {
                            simulKPIStore.relativeEventOccurence = rel;
                        })}
                        valueLabelDisplay={"off"}
                />
                <Typography>{rel}</Typography>
            </Stack>
        </Box>
        <TextField
            id="outlined-number"
            label="Time Delta in Seconds"
            type="number"
            size="small"
            defaultValue={simulKPIStore.timeDeltaInSec}
            onChange={action((event) => {
                simulKPIStore.timeDeltaInSec = parseInt(event.target.value);
            })}
            InputLabelProps={{
                shrink: true,
            }}></TextField>
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
