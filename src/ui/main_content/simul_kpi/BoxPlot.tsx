import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import Chart from 'chart.js/auto';
import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {simulKPIStore} from "../../../shared/store/SimulKPIStore";

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

export const BoxPlot= observer(() => {
    console.log("Rerendering KPI Graphs");
    const classes = useStyles();
    useEffect(() => {
        const ctx = document.getElementById('boxplotChart') as HTMLCanvasElement;
        const data = {
            datasets: simulKPIStore.boxPlotDataSets,
        };
        const config = {
            type: 'scatter',
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
        // @ts-ignore
        const myChart = new Chart(ctx, config);
        return () => {
            console.log("Freeing up reference to old charts");
            myChart.destroy();
        };
    }, [simulKPIStore.boxPlotDataSets]);
    return <>
        <div className={classes.chartContainer} >
            <canvas id="boxplotChart">No canvas</canvas>
        </div>
    </>
})
