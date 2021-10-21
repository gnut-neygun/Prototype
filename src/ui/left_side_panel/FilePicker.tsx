import {Button, Container, IconButton, List, ListItem, ListItemText} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import {Theme} from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import React, {useRef} from "react";
import {Delete} from "@mui/icons-material";
import {observer} from "mobx-react-lite";
import {datasourceStore} from "../../shared/store/DatasourceStore";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        demo: {
            backgroundColor: theme.palette.background.paper,
        },
    }),
);

export const FilePicker= observer(() => {
    const fileStore = datasourceStore.currentFileStore;
    const classes = useStyles();
    const uploadButtonRef = useRef<HTMLInputElement>(null)

    const handleFile = () => {
        const fileList = uploadButtonRef?.current?.files
        if (fileList === null || fileList === undefined)
            fileStore.setFileList(null);
        else {
            // fileList?.item(0)?.text()?.then((data) => console.log(data))
            fileStore.setFileList(fileList);
        }
    };

    return (
        <Container>
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
            <div >
                <List>
                    {[...Array(fileStore.fileList?.length ?? 0).keys()].map(index => {
                        const file = fileStore.fileList?.item(index)
                        return (
                            <ListItem key={file?.name} sx={{
                                marginLeft: '-40px'
                            }}>
                                <IconButton aria-label="delete" size="large">
                                    <Delete/>
                                </IconButton>
                                <ListItemText
                                    primary={file?.name ?? "undefined"}
                                    secondary={file?.type ?? "undefined"}
                                />
                            </ListItem>
                        );
                    })
                    }
                </List>
            </div>
        </Container>
    );
})
