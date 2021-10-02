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
import {datasourceStore} from "../../shared/store/DatasourceStore";
import {observer} from "mobx-react-lite";
import {runInAction} from "mobx";

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
export default observer(() => {
    const newSourceStringMarker = "#new_source"
    const classes = useStyles();
    const availableSources = datasourceStore.availableSources;
    const choosenSource = datasourceStore.currentDataSource;
    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value
        if (value === newSourceStringMarker) {
            setDialogOpen(true);
        } else {
            runInAction(() => {
                datasourceStore.currentDataSource = value
            });
        }
    };
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
    const [textFieldValue, setTextFieldValue] = useState<string>("")

    function handleDialogClose() {
        setDialogOpen(false)
    }

    function handleAddDataSource() {
        if (textFieldValue === "" || availableSources.includes(textFieldValue))
            return;
        else {
            datasourceStore.addNewDataSource(textFieldValue);
        }
        setDialogOpen(false)
        runInAction(() => {
            datasourceStore.currentDataSource = textFieldValue;
        });
    }

    return <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Data source</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={choosenSource}
            onChange={handleChange}
        >
            {availableSources.map(source => <MenuItem key={source} value={source}>{source}</MenuItem>)}
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
})
