import {Theme} from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Chart from 'chart.js/auto';
import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {autorun} from "mobx";
import {datasourceStore} from "../../../shared/store/DatasourceStore";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
            chartContainer: {
                position: "relative",
                height: "40vh",
                width: "80vw"
            }
        }
    )
);
let chart: Chart | null = null;
export const EventDistribution= observer(() => {
    const classes = useStyles();
    useEffect(() => autorun(() =>{
        const ctx = document.getElementById('chart') as HTMLCanvasElement;
        const data = {
            datasets: datasourceStore.currentFileStore.simulKPIStore.eventDistributionPlotData, // full reference for tracking
        };
        const config = {
            type: "scatter" as const,
            data: data,
            options: {
                scales: {
                    x: {
                        type: 'linear' as const,
                        position: 'bottom' as const
                    }
                }
            }
        };
        if (chart !== null) {
            console.log("Freeing up reference to old charts");
            chart.destroy();
        }
        chart = new Chart(ctx, config);
    }), []);
    return <>
        <div className={classes.chartContainer} >
            <canvas id="chart">No canvas</canvas>
        </div>
    </>
})
