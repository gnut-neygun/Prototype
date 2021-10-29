import React from 'react';
import {Theme} from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import {observer} from "mobx-react-lite";
import {datasourceStore} from "../../../../shared/store/DatasourceStore";
import {runInAction} from "mobx";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
    }),
);

export default observer(() =>{
    const classes = useStyles();
    const graphData = datasourceStore.currentFileStore.graphDataStore;
    const handleToggle = (value: string[]) => () => {
        runInAction(() => {
            const graphData = datasourceStore.currentFileStore.graphDataStore;
            const isAlreadyChoosen = graphData.hasSimultaneousNode(value);
            if (isAlreadyChoosen) {
                graphData.removeSimultaneousNode(value);
            } else {
                graphData.addSimultaneousNode(value);
            }
        });
    };

    return (
        <List className={classes.root}>
            {datasourceStore.currentFileStore.simulKPIStore.simultaneousNodes.map((nodeNameArray) => {
                const labelId = `checkbox-list-label-${nodeNameArray}`;

                return (
                    <ListItem key={labelId} role={undefined} dense button onClick={handleToggle(nodeNameArray)}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={graphData.hasSimultaneousNode(nodeNameArray)}
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
})
