import React from 'react';
import clsx from 'clsx';
import {Theme, useTheme} from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    Fab,
    FormControlLabel,
    FormGroup,
    Typography
} from "@mui/material";
import DataSourceChooser from "./DataSourceChooser";
import {FilePicker} from "./FilePicker";
import {ResizeableSidebar} from "./ResizeableSidebar";
import {NavigationMenu} from "./NavigationMenu";
import {datasourceStore} from "../../shared/store/DatasourceStore";
import {observer} from "mobx-react-lite";
import {action} from "mobx";
import {ExpandMore} from "@mui/icons-material";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fixedPosition: {
            position: 'fixed',
            top: 10,
            left: 10,
            'z-index': 1
        },
        root: {
            display: 'flex',
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    }),
);

export const DataPanel = observer(() => {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const theme = useTheme();
    const fileStore = datasourceStore.currentFileStore;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function handleMergeCheckboxChange(event: any, value: boolean){
        datasourceStore.currentFileStore.setMergeStrategy(value);
    }
    async function handleSubmit() {
        await fileStore.updateParsedLog()
    }

    return <>
        <Fab className={clsx(classes.menuButton, open && classes.hide)} color="secondary" aria-label="add"
             classes={{
                 root: classes.fixedPosition
             }}
             onClick={handleDrawerOpen}>
            <MenuIcon/>
        </Fab>
        <ResizeableSidebar
            sx={{
                flexBasis: open ? drawerWidth : 0,
                flexShrink: 0,
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <div className={classes.drawerHeader}>
                <Typography variant={"h5"}>Data Panel</Typography>
                <IconButton onClick={handleDrawerClose} size="large">
                    {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButton>
            </div>
            <Divider/>
            <DataSourceChooser/>
            <FilePicker/>
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
                        <FormControlLabel control={<Checkbox checked={datasourceStore.currentFileStore.lifecycleOption.includes("start")} onChange={action((event) => {
                            if (!event.target.checked) {
                                datasourceStore.currentFileStore.lifecycleOption.popValue("start")
                            } else datasourceStore.currentFileStore.lifecycleOption.push("start")
                        })}/>} label="Start"/>
                        <FormControlLabel control={<Checkbox checked={datasourceStore.currentFileStore.lifecycleOption.includes("complete")} onChange={action((event) => {
                            if (!event.target.checked) {
                                datasourceStore.currentFileStore.lifecycleOption.popValue("complete")
                            } else datasourceStore.currentFileStore.lifecycleOption.push("complete")
                        })}/>} label="Complete"/>
                        <FormControlLabel control={<Checkbox checked={datasourceStore.currentFileStore.lifecycleOption.includes("undefined")}
                                                             onChange={action((event) => {
                                                                 if (!event.target.checked) {
                                                                     datasourceStore.currentFileStore.lifecycleOption.popValue("undefined")
                                                                 } else datasourceStore.currentFileStore.lifecycleOption.push("undefined")
                                                             })}/>}
                                          label="Others"/>
                    </FormGroup>
                    <Divider/>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={fileStore.isMergeLog} onChange={handleMergeCheckboxChange}/>}
                            label="Auto merge log"/>
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            <br/>
            <NavigationMenu/>
        </ResizeableSidebar>
    </>;
})
