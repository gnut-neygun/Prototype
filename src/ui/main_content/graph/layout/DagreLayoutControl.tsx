import {Grid, Slider, Typography} from "@mui/material";
import {FormatLineSpacing, LineStyle} from "@mui/icons-material";
import React from "react";
import {datasourceStore} from "../../../../shared/store/DatasourceStore";
import {observer} from "mobx-react-lite";

export default observer(() =>{
    const currentLayout = datasourceStore.currentFileStore.graphDataStore.layout;
    const handleNodeSpacingChange = (event: any, newValue: number | number[]) => {
        const graphStore = datasourceStore.currentFileStore.graphDataStore;
        const currentLayout = datasourceStore.currentFileStore.graphDataStore.layout;
        const myLayoutOptions = {...currentLayout, nodeSep: newValue as number};
        graphStore.setLayout(myLayoutOptions);
    };
    const handleRankSpacingChange = (event: any, newValue: number | number[]) => {
        const graphStore = datasourceStore.currentFileStore.graphDataStore;
        const currentLayout = datasourceStore.currentFileStore.graphDataStore.layout;
        const myLayoutOptions = {...currentLayout, rankSep: newValue as number};
        graphStore.setLayout(myLayoutOptions);
    };
    return <>
        <Typography id="node-spacing-slider" gutterBottom>
            Node spacing
        </Typography>
        <Grid container spacing={2}>
            <Grid item>
                <LineStyle/>
            </Grid>
            <Grid item xs>
                <Slider value={(currentLayout as any).nodeSep}
                        onChange={handleNodeSpacingChange}
                        aria-labelledby="node-spacing-slider"
                        step={1} min={100} max={300} valueLabelDisplay="auto"/>
            </Grid>
        </Grid>
        <Typography id="rank-spacing-slider" gutterBottom>
            Rank spacing
        </Typography>
        <Grid container spacing={2}>
            <Grid item>
                <FormatLineSpacing/>
            </Grid>
            <Grid item xs>
                <Slider value={(currentLayout as any).rankSep}
                        onChange={handleRankSpacingChange}
                        aria-labelledby="rank-spacing-slider"
                        step={1} min={10} max={150} valueLabelDisplay="auto"/>
            </Grid>
        </Grid>
    </>
})
