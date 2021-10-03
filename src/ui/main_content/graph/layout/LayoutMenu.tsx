import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from "@mui/material/styles";
import createStyles from '@mui/styles/createStyles';
import React from "react";
import DagreLayoutControl from "./DagreLayoutControl";
import {LayoutOptions} from "cytoscape";
import {datasourceStore} from "../../../../shared/store/DatasourceStore";
import {observer} from "mobx-react-lite";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

export const LayoutMenu = observer(() => {
    const classes = useStyles();
    const graphStore = datasourceStore.currentFileStore.graphDataStore;
    const handleChange = (event: SelectChangeEvent) => {
        const graphStore = datasourceStore.currentFileStore.graphDataStore;
        const newLayoutName = event.target.value
        let layoutOptions: LayoutOptions
        if (newLayoutName === "klay") {
            layoutOptions = {
                ...graphStore.layout,
                name: newLayoutName,
                // @ts-ignore
                nodeDimensionsIncludeLabels: true,
                klay: {
                    layoutHierarchy: false
                }
            };
        } else {
            layoutOptions = {
                ...graphStore.layout,
                name: newLayoutName
            };
        }
        graphStore.setLayout(layoutOptions);
    };

    function renderPanelItem() {
        if (graphStore.layout.name === "dagre")
            return <DagreLayoutControl/>
        else
            return <></>
    }

    return <>
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Layout</InputLabel>
            <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={graphStore.layout.name}
                onChange={handleChange}
                label="Layout"
            >
                <MenuItem value={"dagre"}>dagre</MenuItem>
                <MenuItem value={"cose-bilkent"}>cose-bilkent</MenuItem>
                <MenuItem value={"klay"}>klay</MenuItem>
            </Select>
        </FormControl>
        {renderPanelItem()}
    </>
})
