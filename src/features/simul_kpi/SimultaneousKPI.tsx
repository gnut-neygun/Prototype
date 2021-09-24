import {makeStyles, Theme, useTheme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import Chart from 'chart.js/auto';
import {useEffect} from "react";

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

export function SimultaneousKPI() {
    const classes = useStyles();
    const theme = useTheme();
    useEffect(() => {
        const ctx = document.getElementById('chart') as HTMLCanvasElement;
        const data = {
            datasets: [{
                label: 'Scatter Dataset',
                data: [{
                    x: -10,
                    y: 0
                }, {
                    x: 0,
                    y: 10
                }, {
                    x: 10,
                    y: 5
                }, {
                    x: 0.5,
                    y: 5.5
                }],
                backgroundColor: 'rgb(255, 99, 132)'
            }],
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
            console.log("im destroyed");
            myChart.destroy();
        };
    }, []);
    return <>
        <div className={classes.chartContainer} >
            <canvas id="chart">No canvas</canvas>
        </div>
    </>
}
