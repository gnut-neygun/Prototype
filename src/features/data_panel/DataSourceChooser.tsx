import {createStyles, makeStyles} from "@material-ui/core/styles";
import {FormControl, InputLabel, MenuItem, Select, Theme} from "@material-ui/core";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {reduxActions} from "../../app/graphDataSlice";

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

export default function DataSourceChooser() {
    const classes = useStyles();
    const availableSources = useAppSelector(state => state.graphData.dataSource)
    const choosenSource = useAppSelector(state => state.graphData.choosenSource);
    const dispatch = useAppDispatch()
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        dispatch(reduxActions.setChoosenSource(event.target.value as string));
    };

    return <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Data source</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={choosenSource}
            onChange={handleChange}
        >
            {availableSources.map(source => <MenuItem key={source.name} value={source.name}>{source.name}</MenuItem>)}
        </Select>
    </FormControl>
};
