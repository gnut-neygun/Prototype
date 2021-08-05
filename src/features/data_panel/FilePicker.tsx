import {Button, Container, createStyles, IconButton, List, ListItem, ListItemText} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React, {useRef} from "react";
import {Delete} from "@material-ui/icons";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {reduxActions} from "../../app/graphDataSlice";

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
            dispatch(reduxActions.setFiles({source: currentDataSource, files: fileList}));
        }
    };

    return <Container>
        <Button
            variant="contained"
            component="label"
        >
            Upload File
            <input
                ref={uploadButtonRef}
                type="file"
                onChange={handleFile}
                hidden
                multiple
            />
        </Button>
        <div className={classes.demo}>
            <List>
                {[...Array(currentInputFiles?.length ?? 0).keys()].map(index => {
                    const file = currentInputFiles?.item(index)
                    return (
                        <ListItem>
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
    </Container>;
}
