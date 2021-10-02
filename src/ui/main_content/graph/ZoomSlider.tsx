import {Grid, Slider, Typography} from "@mui/material";
import {ZoomIn} from "@mui/icons-material";
import React, {useContext, useState} from "react";
import {CytoscapeContext} from "./GraphControlPanel";

export default function ZoomSlider() {
    const cy = useContext(CytoscapeContext)
    const [zoomState, setZoomState] = useState<number>(Number(cy.zoom().toFixed(2)));
    const handleZoomLevelChange = (event: any, newValue: number | number[]) => {
        cy.zoom(newValue as number);
        setZoomState(Number(cy.zoom().toFixed(2)))
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
