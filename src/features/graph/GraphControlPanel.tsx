import {Grid, Slider, Typography} from "@material-ui/core";
import {LineStyle} from "@material-ui/icons";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {graphPropertySelector, setNodeSpacing} from "./graphPropertySlice";

export function GraphControlPanel() {
    const graphProperty = useAppSelector(graphPropertySelector)
    const dispatch = useAppDispatch()
    const handleChange = (event: any, newValue: number | number[]) => {
        dispatch(setNodeSpacing(newValue as number))
    };
    return (
        <div id="graph-control-panel" style={{width: "15%"}}>
            <Typography id="continuous-slider" gutterBottom>
                Node spacing
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <LineStyle/>
                </Grid>
                <Grid item xs>
                    <Slider defaultValue={graphProperty.nodeSpacing} onChange={handleChange}
                            aria-labelledby="continuous-slider"
                            step={1} min={100} max={300} valueLabelDisplay="auto"/>
                </Grid>
            </Grid>
        </div>
    )
}
