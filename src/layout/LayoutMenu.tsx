import {FormControl, InputLabel, makeStyles, MenuItem, Select} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {graphDataSelector, setLayout} from "../app/graphDataSlice";
import React from "react";
import DagreLayoutControl from "./DagreLayoutControl";

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
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        dispatch(setLayout({
            ...currentLayout,
            name: event.target.value as string
        }))
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
            </Select>
        </FormControl>
        {renderPanelItem()}
    </>
}
