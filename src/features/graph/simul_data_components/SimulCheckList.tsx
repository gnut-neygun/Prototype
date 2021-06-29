import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {graphDataSelector, reduxActions} from "../../../app/graphDataSlice";
import {Set} from "typescript-collections";
import cloneDeep from 'lodash.clonedeep';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
    }),
);

export default function SimulCheckList() {
    const classes = useStyles();
    const graphData = useAppSelector(graphDataSelector);
    const dispatch = useAppDispatch();
    const handleToggle = (value: string[]) => () => {
        const selectedNodes = new Set<string[]>();
        graphData.selectedSimultaneousNodes.forEach(nodeName => selectedNodes.add(nodeName));
        const isAlreadyChoosen = selectedNodes.contains(value);
        const clonedState = cloneDeep(selectedNodes);
        if (isAlreadyChoosen) {
            clonedState.remove(value);
            dispatch(reduxActions.setSelectedSimultaneousNodes(clonedState.toArray()));
        } else {
            clonedState.add(value);
            dispatch(reduxActions.setSelectedSimultaneousNodes(clonedState.toArray()));
        }
    };

    const selectedNodes = new Set<string[]>();
    graphData.selectedSimultaneousNodes.forEach(nodeName => selectedNodes.add(nodeName));

    return (
        <List className={classes.root}>
            {graphData.simultaneousNodes.map((nodeNameArray) => {
                const labelId = `checkbox-list-label-${nodeNameArray}`;

                return (
                    <ListItem key={labelId} role={undefined} dense button onClick={handleToggle(nodeNameArray)}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={selectedNodes.contains(nodeNameArray)}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{'aria-labelledby': labelId}}
                            />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={nodeNameArray.join("-")}/>
                    </ListItem>
                );
            })}
        </List>
    );
}
