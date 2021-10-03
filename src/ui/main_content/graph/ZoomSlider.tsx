import {Grid, Slider, Typography} from "@mui/material";
import {ZoomIn} from "@mui/icons-material";
import React, {useState} from "react";
import {datasourceStore} from "../../../shared/store/DatasourceStore";

export default function ZoomSlider() {
    const graphStore = datasourceStore.currentFileStore.graphDataStore;
    const [zoomState, setZoomState] = useState<number>(graphStore.getZoomLevel());
    const handleZoomLevelChange = (event: any, newValue: number | number[]) => {
        graphStore.changeZoomLevel(newValue as number);
        setZoomState(graphStore.getZoomLevel());
    };
    return <>
        <Typography id="zoom-slider" gutterBottom>
            Zoom level
        </Typography>
        <Grid container spacing={2}>
            <Grid item>
                <ZoomIn/>
            </Grid>
            <Grid item xs>
                <Slider value={zoomState} onChange={handleZoomLevelChange}
                        aria-labelledby="zoom-slider"
                        step={0.001} min={0.3} max={2} valueLabelDisplay="auto"/>
            </Grid>
        </Grid>
    </>
};
