import {Checkbox, FormControlLabel, Grid, Slider, Typography} from "@material-ui/core";
import {LineStyle, ZoomIn} from "@material-ui/icons";
import React, {useState} from "react";
import {Core} from "cytoscape";
import {layoutOptions} from "./CytoscapeInitProperties";
import {BubbleSetPath, BubbleSetsPlugin} from "cytoscape-bubblesets";
import {useAppSelector} from "../../app/hooks";
import {graphDataSelector} from "./graphDataSlice";

export function GraphControlPanel({cy}: { cy: Core }) {
    const graphProperty = useAppSelector(graphDataSelector);
    const handleNodeSpacingChange = (event: any, newValue: number | number[]) => {
        const myLayoutOptions = {...layoutOptions, nodeSep: newValue as number};
        cy.layout(myLayoutOptions).run();
    };
    const handleZoomLevelChange = (event: any, newValue: number | number[]) => {
        cy.zoom(newValue as number);
    };
    const handleBubbleSetCheckbox = () => {
        cy.ready(() => {
            const bb = new BubbleSetsPlugin(cy);
            if (bubbleSetInstances === null) {
                const myBubleSetInstances = []
                const simultaneousNodes = graphProperty.simultaneousNodes
                for (const simulCluster of simultaneousNodes) {
                    const myNodeCollection = simulCluster.reduce((accumulator, nodeId) => accumulator.union(cy.$id(nodeId)), cy.collection())
                    myBubleSetInstances.push(bb.addPath(myNodeCollection.nodes(), myNodeCollection.edgesWith(myNodeCollection), null))
                }
                setBubbleSetInstance(myBubleSetInstances)
            } else {
                for (const instance of bubbleSetInstances) {
                    instance.remove();
                }
                setBubbleSetInstance(null);
            }
        });
    };
    const [bubbleSetInstances, setBubbleSetInstance] = useState<BubbleSetPath[] | null>(null);
    return (
        <div id="graph-control-panel" style={{width: "15%"}}>
            <Typography id="node-spacing-slider" gutterBottom>
                Node spacing
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <LineStyle/>
                </Grid>
                <Grid item xs>
                    <Slider defaultValue={layoutOptions.nodeSep} onChange={handleNodeSpacingChange}
                            aria-labelledby="node-spacing-slider"
                            step={1} min={100} max={300} valueLabelDisplay="auto"/>
                </Grid>
            </Grid>
            <Typography id="zoom-slider" gutterBottom>
                Zoom level
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <ZoomIn/>
                </Grid>
                <Grid item xs>
                    <Slider defaultValue={1} onChange={handleZoomLevelChange}
                            aria-labelledby="zoom-slider"
                            step={0.001} min={0.3} max={3} valueLabelDisplay="auto"/>
                </Grid>
            </Grid>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={bubbleSetInstances !== null}
                        onChange={handleBubbleSetCheckbox}
                        name="bubbleSetCheckbox"
                        color="primary"
                    />
                }
                label="Bubble set view"
            />
        </div>
    )
}
