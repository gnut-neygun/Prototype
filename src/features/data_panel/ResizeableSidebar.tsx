import React, {useState} from "react";
import {createStyles, Drawer} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
            root: {
                flexGrow: 1,
                height: 430,
                zIndex: 1,
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                width: '100%'
            },
            navIconHide: {
                [theme.breakpoints.up('md')]: {
                    display: 'none'
                }
            },
            toolbar: theme.mixins.toolbar,
            drawerPaper: {
                width: drawerWidth,
                [theme.breakpoints.up('md')]: {
                    position: 'relative'
                }
            },
            content: {
                flexGrow: 1,
                backgroundColor: theme.palette.background.default,
                padding: theme.spacing(3)
            },
            dragger: {
                width: '5px',
                cursor: 'ew-resize',
                padding: '4px 0 0',
                borderTop: '1px solid #ddd',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 100,
                backgroundColor: '#f4f7f9'
            }
        }
    )
);

export function ResizeableSidebar(props: React.ComponentProps<typeof Drawer>) {
    const classes = useStyles();

    const [newWidth, setNewWidth] = useState(200)

    const handleMousemove = (e: MouseEvent) => {
        if (e.buttons === 0)
            return
        console.log(e.clientX)
        setNewWidth(e.clientX)
    };


    const handleMouseup = (e: MouseEvent) => {
        document.removeEventListener("mousemove", handleMousemove)
        document.removeEventListener("mouseup", handleMouseup)
    }

    const handleMousedown = (e: React.MouseEvent) => {
        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);
    };


    return <Drawer
        PaperProps={{style: {width: newWidth}}}
        {...props}
    >
        {props.children}
        <div
            id="dragger"
            onMouseDown={handleMousedown}
            className={classes.dragger}
        />
    </Drawer>
}
