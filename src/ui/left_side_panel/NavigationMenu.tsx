import {Theme, useTheme} from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Typography
} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import {Link} from 'react-router-dom';
import {ExpandMore} from "@mui/icons-material";
import React from "react";
import {observer} from "mobx-react-lite";
import {datasourceStore} from "../../shared/store/DatasourceStore";
import {action} from "mobx";
import Divider from "@mui/material/Divider";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
            heading: {
                fontSize: theme.typography.pxToRem(15),
                fontWeight: theme.typography.fontWeightRegular,
            }
        }
    )
);

export const NavigationMenu = observer(() => {
    const fileStore = datasourceStore.currentFileStore
    const classes = useStyles();
    const theme = useTheme();
    return <>
        <Accordion>
            <AccordionSummary
                aria-controls="panel1a-content"
                id="panel3a-header"
            >
                <Typography className={classes.heading}>
                    <Link to="/">Main Graph</Link>
                </Typography>
            </AccordionSummary>
        </Accordion>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="panel3a-content"
                id="panel3a-header"
            >
                <Typography sx={{
                    fontSize: theme.typography.pxToRem(15),
                    fontWeight: theme.typography.fontWeightRegular,
                }}>Data configuration</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography sx={{
                    fontSize: theme.typography.pxToRem(18),
                    fontWeight: theme.typography.fontWeightRegular,
                }} align="center">Life cycle options</Typography>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox checked={datasourceStore.currentFileStore.lifecycleOption.includes("start")}
                                           onChange={action((event) => {
                                               if (!event.target.checked) {
                                                   datasourceStore.currentFileStore.lifecycleOption.popValue("start")
                                               } else datasourceStore.currentFileStore.lifecycleOption.push("start")
                                           })}/>} label="Start"/>
                    <FormControlLabel control={<Checkbox
                        checked={datasourceStore.currentFileStore.lifecycleOption.includes("complete")}
                        onChange={action((event) => {
                            if (!event.target.checked) {
                                datasourceStore.currentFileStore.lifecycleOption.popValue("complete")
                            } else datasourceStore.currentFileStore.lifecycleOption.push("complete")
                        })}/>} label="Complete"/>
                    <FormControlLabel control={<Checkbox
                        checked={datasourceStore.currentFileStore.lifecycleOption.includes("undefined")}
                        onChange={action((event) => {
                            if (!event.target.checked) {
                                datasourceStore.currentFileStore.lifecycleOption.popValue("undefined")
                            } else datasourceStore.currentFileStore.lifecycleOption.push("undefined")
                        })}/>}
                                      label="Undefined"/>
                    <Divider/>
                </FormGroup>
                <Divider/>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox checked={fileStore.isMergeLog} onChange={(event, value) => {
                            datasourceStore.currentFileStore.setMergeStrategy(value)
                        }}/>}
                        label="Auto merge log"/>
                </FormGroup>
                {fileStore.isMergeLog && <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Merge attribute</InputLabel>
                    <Select
                        value={fileStore.mergeAttribute ?? ""}
                        label="Merge attribute"
                        onChange={action((event: SelectChangeEvent<string>) => {
                            fileStore.mergeAttribute = event.target.value
                        })}
                    >
                        {fileStore.mergeAttributes.map(attr => <MenuItem key={attr} value={attr}>{attr}</MenuItem>)}
                    </Select>
                </FormControl>}
            </AccordionDetails>
        </Accordion>
        <Paper>
            <Stack spacing={2} sx={{marginTop: "20px", padding: "10px"}}>
                <Link to="/events">Event Distribution</Link>
                <Link to="/clusters">Simultaneous Clusters</Link>
                <Link to="/execution">Execution Chart</Link>
                <Link to="/pairs">Event Pair Graph</Link>
            </Stack>
        </Paper>

    </>;
})
