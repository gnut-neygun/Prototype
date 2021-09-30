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

export const SimultaneousKPI= observer(() => {
    console.log("Rerendering KPI Graphs");
    const classes = useStyles();
    useEffect(() => {
        const ctx = document.getElementById('chart') as HTMLCanvasElement;
        const data = {
            datasets: simulKPIStore.dataSets,
        };
        const config = {
            type: "scatter",
            data: data,
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    }
                }
            }
        };
        // @ts-ignore
        const myChart = new Chart(ctx, config);
        return () => {
            console.log("Freeing up reference to old charts");
            myChart.destroy();
        };
    }, [simulKPIStore.dataSets]);
    return <>
        <div className={classes.chartContainer} >
            <canvas id="chart">No canvas</canvas>
        </div>
    </>
})
