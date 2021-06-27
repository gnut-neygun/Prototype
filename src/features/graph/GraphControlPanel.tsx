import {Checkbox, FormControlLabel, Grid, Slider, Typography} from "@material-ui/core";
import {LineStyle, ZoomIn} from "@material-ui/icons";
import React, {useEffect, useState} from "react";
import {Core} from "cytoscape";
import {layoutOptions} from "./CytoscapeInitProperties";
import {BubbleSetPath, BubbleSetsPlugin} from "cytoscape-bubblesets";
import {useAppSelector} from "../../app/hooks";
import {graphDataSelector} from "./graphDataSlice";
import {GraphDataPanel} from "./GraphDataPanel";
import {generateRandomColor} from "../../Utilities";

export function GraphControlPanel({cy}: { cy: Core }) {
    const graphProperty = useAppSelector(graphDataSelector);
    const bb = new BubbleSetsPlugin(cy);
    const handleNodeSpacingChange = (event: any, newValue: number | number[]) => {
        const myLayoutOptions = {...layoutOptions, nodeSep: newValue as number};
        cy.layout(myLayoutOptions).run();
    };
    const handleZoomLevelChange = (event: any, newValue: number | number[]) => {
        cy.zoom(newValue as number);
    };
    const refreshBubbleSet = function () {
        cy.ready(() => {
            for (const instance of bubbleSetInstances) {
                instance.remove();
            }
            const myBubleSetInstances = [];
            const simultaneousNodes = graphProperty.selectedSimultaneousNodes;
            const randomColors = generateRandomColor(simultaneousNodes.length);
            for (const [index, simulCluster] of simultaneousNodes.entries()) {
                const myNodeCollection = simulCluster.reduce((accumulator, nodeId) => accumulator.union(cy.$id(nodeId)), cy.collection())

                myBubleSetInstances.push(bb.addPath(myNodeCollection, null, cy.nodes().diff(myNodeCollection).left, {
                    virtualEdges: true,
                    // @ts-ignore
                    style: {
                        fill: 'rgba(70, 130, 180, 0.2)',
                        stroke: randomColors[index],
                        // @ts-ignore
                        "stroke-width": 2
                    },
                }))
            }
            setBubbleSetInstance(myBubleSetInstances);
        });
    };
    const handleBubbleSetCheckbox = () => {
        if (isBubbleSetChecked) {
            //the condition is inverted because this indicate changes in checkbox state
            for (const instance of bubbleSetInstances) {
                instance.remove();
            }
            setBubbleSetInstance([]);
        } else refreshBubbleSet();
        setIsBubbleSetChecked(!isBubbleSetChecked);
    };
    const [bubbleSetInstances, setBubbleSetInstance] = useState<BubbleSetPath[]>([]);
    const [isBubbleSetChecked, setIsBubbleSetChecked] = useState(true);
    useEffect(() => {
        if (isBubbleSetChecked)
            refreshBubbleSet();
        else {
            for (const instance of bubbleSetInstances) {
                instance.remove();
            }
            setBubbleSetInstance([]);
        }
    }, [JSON.stringify(graphProperty.selectedSimultaneousNodes)]);
    return (
        <div id="graph-control-panel" style={{width: "20%"}}>
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
                        checked={isBubbleSetChecked}
                        onChange={handleBubbleSetCheckbox}
                        name="bubbleSetCheckbox"
                        color="primary"
                    />
                }
                label="Bubble set view"
            />
            <GraphDataPanel cy={cy}/>
        </div>
    );
}
