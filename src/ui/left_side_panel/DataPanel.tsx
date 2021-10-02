import React from 'react';
import clsx from 'clsx';
import {Theme, useTheme} from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {Fab, Typography} from "@mui/material";
import DataSourceChooser from "./DataSourceChooser";
import {FilePicker} from "./FilePicker";
import {ResizeableSidebar} from "./ResizeableSidebar";
import {NavigationMenu} from "./NavigationMenu";

const drawerWidth = 240;

const useStyles = (isOpen: boolean) => makeStyles((theme: Theme) =>
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
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            flexBasis: isOpen? drawerWidth : 0,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
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

export default function PersistentDrawerLeft() {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles(open)();
    const theme = useTheme();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return <>
        <CssBaseline/>
        <Fab className={clsx(classes.menuButton, open && classes.hide)} color="secondary" aria-label="add"
             classes={{
                 root: classes.fixedPosition
             }}
             onClick={handleDrawerOpen}>
            <MenuIcon/>
        </Fab>
        <ResizeableSidebar
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}>
            <div className={classes.drawerHeader}>
                <Typography variant={"h5"}>Data Panel</Typography>
                <IconButton onClick={handleDrawerClose} size="large">
                    {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButton>
            </div>
            <Divider/>
            <DataSourceChooser/>
            <FilePicker/>
            <br/>
            <NavigationMenu/>
        </ResizeableSidebar>
    </>;
}
