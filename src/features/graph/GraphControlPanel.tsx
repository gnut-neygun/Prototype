import {Checkbox, FormControlLabel, Grid, Slider, Typography} from "@material-ui/core";
import {FormatLineSpacing, LineStyle, ZoomIn} from "@material-ui/icons";
import React, {useEffect, useState} from "react";
import {Core} from "cytoscape";
import {BubbleSetPath, BubbleSetsPlugin} from "cytoscape-bubblesets";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {graphDataSelector, setLayout} from "../../app/graphDataSlice";
import {GraphDataPanel} from "./GraphDataPanel";
import {generateRandomColor} from "../../Utilities";


export const CytoscapeContext = React.createContext<Core>({} as Core);

export function GraphControlPanel({cy}: { cy: Core }) {
    const graphProperty = useAppSelector(graphDataSelector);
    const dispatch = useAppDispatch();
    const bb = new BubbleSetsPlugin(cy);
    const handleNodeSpacingChange = (event: any, newValue: number | number[]) => {
        const myLayoutOptions = {...graphProperty.layoutOptions, nodeSep: newValue as number};
        dispatch(setLayout(myLayoutOptions));
    };
    const handleRankSpacingChange = (event: any, newValue: number | number[]) => {
        const myLayoutOptions = {...graphProperty.layoutOptions, rankSep: newValue as number};
        dispatch(setLayout(myLayoutOptions));
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
        <CytoscapeContext.Provider value={cy}>
            <div id="graph-control-panel" style={{width: "20%"}}>
                <Typography id="node-spacing-slider" gutterBottom>
                    Node spacing
                </Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <LineStyle/>
                    </Grid>
                    <Grid item xs>
                        <Slider defaultValue={(graphProperty.layoutOptions as any).nodeSep}
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
                        <Slider defaultValue={(graphProperty.layoutOptions as any).rankSep}
                                onChange={handleRankSpacingChange}
                                aria-labelledby="rank-spacing-slider"
                                step={1} min={10} max={150} valueLabelDisplay="auto"/>
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
                <GraphDataPanel/>
            </div>
        </CytoscapeContext.Provider>

    );
}
