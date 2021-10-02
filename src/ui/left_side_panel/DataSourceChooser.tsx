import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Theme,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {Add} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../../shared/hooks";
import {reduxActions} from "../../shared/graphDataSlice";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        dialogContent: {
            //Align button with the text field
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
        }
    }),
);
export default function DataSourceChooser() {
    const newSourceStringMarker = "#new_source"
    const classes = useStyles();
    const availableSources = useAppSelector(state => state.graphData.dataSource)
    const choosenSource = useAppSelector(state => state.graphData.choosenSource);
    const dispatch = useAppDispatch()
    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value
        if (value === newSourceStringMarker) {
            setDialogOpen(true)
        } else dispatch(reduxActions.setChoosenSource(event.target.value as string));
    };
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
    const [textFieldValue, setTextFieldValue] = useState<string>("")

    function handleDialogClose() {
        setDialogOpen(false)
    }

    function handleAddDataSource() {
        if (textFieldValue === "")
            return;
        else {
            dispatch(reduxActions.addDataSource(textFieldValue));
        }
        setDialogOpen(false)
        dispatch(reduxActions.setChoosenSource(textFieldValue));
    }

    return <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Data source</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={choosenSource}
            onChange={handleChange}
        >
            {availableSources.map(source => <MenuItem key={source.name} value={source.name}>{source.name}</MenuItem>)}
            <MenuItem key={newSourceStringMarker} value={newSourceStringMarker}>
                <Add/>
                <Typography>new data source</Typography>
            </MenuItem>
        </Select>
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Enter data source name</DialogTitle>
            <DialogContent>
                <div className={classes.dialogContent}>
                    <TextField label="Data source name" onChange={event =>
                        setTextFieldValue(event.target.value)}/>
                    <Button variant="outlined" onClick={handleAddDataSource}>Add</Button>
                </div>
            </DialogContent>
        </Dialog>
    </FormControl>
}
