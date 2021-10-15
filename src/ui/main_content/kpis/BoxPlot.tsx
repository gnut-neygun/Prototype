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
export const BoxPlot= observer(() => {
    console.log("Rerendering KPI Graphs");
    const classes = useStyles();
    useEffect(() => autorun(() =>{
        const ctx = document.getElementById('boxplotChart') as HTMLCanvasElement;
        const data = {
            datasets: datasourceStore.currentFileStore.simulKPIStore.boxPlotDataSets,
        };
        const config = {
            type: 'scatter' as const,
            data: data,
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context: any) {
                                const datetime = new Date(context.parsed.x);
                                let ret: string=
                                    `Events num: ${context.parsed.y}, Median date time: ${datetime.toDateString()} at ${datetime.toTimeString()}`
                                return ret;
                            }
                        }
                    }
                }
            },
        };
        if (chart !== null) {
            console.log("Freeing up reference to old charts");
            chart.destroy();
        }
        // @ts-ignore
        chart = new Chart(ctx, config);
    }), []);
    return <>
        <div className={classes.chartContainer} >
            <canvas id="boxplotChart">No canvas</canvas>
        </div>
    </>
})
