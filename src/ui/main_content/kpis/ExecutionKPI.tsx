import {Theme} from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Chart from 'chart.js/auto';
import {useEffect, useState} from "react";
import {MatrixController, MatrixElement} from "chartjs-chart-matrix";
import {Slider, Stack, Typography} from "@mui/material";
import {Palette} from "@mui/icons-material";
import {observer} from "mobx-react-lite";
import {autorun, runInAction} from "mobx";
import {datasourceStore} from "../../../shared/store/DatasourceStore";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
            chartContainer: {
                padding: 10,
                marginTop: 45,
                position: "relative",
                height: "40vh",
                width: "80vw",
            }
        }
    )
);
let chart: Chart | null = null;
export const ExecutionKPI = observer(() => {
    const executionKPIStore = datasourceStore.currentFileStore.executionKPIStore
    const classes = useStyles();
    useEffect(() => autorun(() => {
        const ctx = document.getElementById('heatmap-chart') as HTMLCanvasElement;
        Chart.register(MatrixController, MatrixElement);
        const config = {
            type: 'matrix' as const,
            data: datasourceStore.currentFileStore.executionKPIStore.heatMapData,
            options: {
                plugins: {
                    legend: false,
                    tooltip: {
                        callbacks: {
                            title() {
                                return '';
                            },
                            label(context: any) {
                                const v = context.dataset.data[context.dataIndex];
                                return ['x: ' + v.x, 'y: ' + v.y, 'v: ' + v.v];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        offset: true,
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        };
        if (chart !== null) {
            console.log("Freeing up reference to old charts");
            chart.destroy();
        }
        // @ts-ignore
        chart = new Chart(ctx, config);
    }), []);
    const [colorValue, setColorValue] = useState<number>(executionKPIStore.colorHue)

    function handleColorChange(event: any, newValue: number | number[]) {
        runInAction(() => {
            executionKPIStore.colorHue = newValue as number;
        });
        setColorValue(newValue as number);
    }

    return <>
        <div className={classes.chartContainer}>
            <canvas id="heatmap-chart">No canvas</canvas>
        </div>
        <div style={{marginLeft: 10, padding: 20}}>
            <Stack spacing={2} direction="row" sx={{mb: 1, width: 320, marginTop: 10}} alignItems="center">
                <Palette/>
                <Typography>Color</Typography>
                <Slider aria-label="color" value={colorValue} min={0} max={360} onChange={handleColorChange}
                        valueLabelDisplay={"auto"}/>
            </Stack>
        </div>
    </>
})
