import {Button, Checkbox, Divider, FormControlLabel} from "@mui/material";
import React from "react";
import {ISCPanel} from "./ISCPanel";
import {LayoutMenu} from "./layout/LayoutMenu";
import ZoomSlider from "./ZoomSlider";
import {observer} from "mobx-react-lite";
import {datasourceStore} from "../../../shared/store/DatasourceStore";
import {runInAction} from "mobx";

export const GraphControlPanel = observer(() => {
    const graphStore = datasourceStore.currentFileStore.graphDataStore;
    const handleBubbleSetCheckbox = () => {
        runInAction(
            () => {
                const graphStore = datasourceStore.currentFileStore.graphDataStore;
                const isSetChecked = datasourceStore.currentFileStore.graphDataStore.isSetChecked
                if (isSetChecked) {
                    //the condition is inverted because this indicate changes in checkbox state
                    graphStore.clearBubbleSet();
                } else graphStore.refreshBubbleSet()
                datasourceStore.currentFileStore.graphDataStore.isSetChecked = !isSetChecked;
            }
        );

    };

    return <div id="graph-control-panel" style={{width: "20%"}}>
                <LayoutMenu/>
                <Divider/>
                <ZoomSlider/>
                <Button variant={"text"} style={{margin: "10px"}} onClick={graphStore.zoomFit.bind(graphStore)}>Zoom fit and center</Button>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={datasourceStore.currentFileStore.graphDataStore.isSetChecked}
                            onChange={handleBubbleSetCheckbox}
                            name="bubbleSetCheckbox"
                            color="primary"
                        />
                    }
                    label="Bubble set view"
                />
                <ISCPanel/>
            </div>
})
