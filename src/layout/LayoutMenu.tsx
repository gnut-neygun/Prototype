import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from "@mui/material/styles";
import createStyles from '@mui/styles/createStyles';
import React from "react";
import DagreLayoutControl from "./DagreLayoutControl";
import {LayoutOptions} from "cytoscape";
import {useAppDispatch, useAppSelector} from "../shared/hooks";
import {graphDataSelector, setLayout} from "../shared/graphDataSlice";

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

export function LayoutMenu() {
    const classes = useStyles();
    const currentLayout = useAppSelector(state => graphDataSelector(state).layout)
    const dispatch = useAppDispatch()
    const handleChange = (event: SelectChangeEvent<string>) => {
        const newLayoutName = event.target.value
        let layoutOptions: LayoutOptions
        if (newLayoutName === "klay") {
            layoutOptions = {
                ...currentLayout,
                name: newLayoutName,
                // @ts-ignore
                nodeDimensionsIncludeLabels: true,
                klay: {
                    layoutHierarchy: false
                }
            };
        } else {
            layoutOptions = {
                ...currentLayout,
                name: newLayoutName
            };
        }
        dispatch(setLayout(layoutOptions));
    };

    function renderPanelItem() {
        if (currentLayout.name === "dagre")
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
                value={currentLayout.name}
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
}
