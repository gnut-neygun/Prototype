import {Button, Container, createStyles, IconButton, List, ListItem, ListItemText} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React, {useRef} from "react";
import {Delete} from "@material-ui/icons";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {reduxActions} from "../../app/graphDataSlice";
import {GraphType} from "../../server_api/types";
import {requestHeuristicMiner} from "../../server_api/api";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        demo: {
            backgroundColor: theme.palette.background.paper,
        },
    }),
);


export function FilePicker() {
    const currentDataSource = useAppSelector(state => state.graphData.choosenSource)
    const currentInputFiles = useAppSelector(state => state.graphData.dataSource.filter(source => source.name === currentDataSource)[0].inputFiles) as FileList | null
    const dispatch = useAppDispatch()
    const classes = useStyles();
    const uploadButtonRef = useRef<HTMLInputElement>(null)

    const handleFile = () => {
        const fileList = uploadButtonRef?.current?.files
        if (fileList === null || fileList === undefined)
            dispatch(reduxActions.setFiles({source: currentDataSource, files: null}));
        else {
            // fileList?.item(0)?.text()?.then((data) => console.log(data))
            dispatch(reduxActions.setFiles({source: currentDataSource, files: fileList}));
        }
    };

    async function handleSubmit() {
        const fileList = uploadButtonRef?.current?.files
        if (fileList === null || fileList === undefined)
            return;
        else {
            for (const file of fileList) {
                const fileContent = await file.text()
                const response = await requestHeuristicMiner(GraphType.heuristic_net, fileContent)
                console.log(response)
            }
        }
    }

    return <Container>
        <Button
            variant="outlined"
            component="label"
        >
            Upload File
            <input
                ref={uploadButtonRef}
                type="file"
                onChange={handleFile}
                accept=".xes"
                hidden
                multiple
            />
        </Button>
        <div className={classes.demo}>
            <List>
                {[...Array(currentInputFiles?.length ?? 0).keys()].map(index => {
                    const file = currentInputFiles?.item(index)
                    return (
                        <ListItem key={file?.name}>
                            <IconButton aria-label="delete">
                                <Delete/>
                            </IconButton>
                            <ListItemText
                                primary={file?.name ?? "undefined"}
                                secondary={file?.type ?? "undefined"}
                            />
                        </ListItem>)
                })
                }
            </List>
        </div>
        <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
    </Container>;
}
