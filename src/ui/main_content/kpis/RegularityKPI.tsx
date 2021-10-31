import {Theme} from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Chart from 'chart.js/auto';
import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {action, autorun} from "mobx";
import {datasourceStore} from "../../../shared/store/DatasourceStore";
import de from "date-fns/locale/de";
import {XesEvent} from "../../../algorithm/parser/XESModels";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {PairType} from "../../../shared/store/RegularityKPIStore";

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

function formatTimeDuration(timeDeltaInMillis: number) {
    const timeDelta = timeDeltaInMillis / 1000;
    let hours = Math.floor(timeDelta / 3600);
    let minutes = Math.floor((timeDelta - (hours * 3600)) / 60);
    let seconds = timeDelta - (hours * 3600) - (minutes * 60);

    if (hours < 10) { // @ts-ignore
        hours = "0" + hours.toString();
    }
    if (minutes < 10) { // @ts-ignore
        minutes = "0" + minutes.toString();
    }
    if (seconds < 10) { // @ts-ignore
        seconds = "0" + seconds.toString();
    }
    return hours + ':' + minutes + ':' + seconds;
}

export const RegularityKPI = observer(() => {
    const regularityKPIStore = datasourceStore.currentFileStore.regularityKPIStore
    const classes = useStyles();
    useEffect(() => autorun(() => {
        const ctx = document.getElementById('trace-chart') as HTMLCanvasElement;
        const config = {
            type: 'scatter' as const,
            data: {
                datasets: datasourceStore.currentFileStore.regularityKPIStore.traceChartData
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Event Pair Graph',
                        padding: {
                            top: 10,
                            bottom: 30
                        },
                        color: 'red',
                        font: {
                            weight: 'bold',
                            size: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title(context: any) {
                                const datetime = new Date(context[0].parsed.x);
                                return `Start at ${datetime.toLocaleString()}`
                            },
                            label(context: any) {
                                const pair: XesEvent = context.raw.eventPair
                                return [`Start Event: ${pair[0].toString()}`, `End event: ${pair[1].toString()}`, `Time delta: ${formatTimeDuration(pair[2])}`];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time Occurence',
                            color: '#191',
                            font: {
                                family: 'Comic Sans MS',
                                size: 20,
                                weight: 'bold',
                                lineHeight: 1.2
                            },
                            padding: {top: 30, left: 0, right: 0, bottom: 0}
                        },
                        time: {
                            // Luxon format string
                            tooltipFormat: 'dd T'
                        },
                        type: 'time',
                        adapters: {
                            date: {
                                locale: de
                            }
                        },
                        grid: {
                            color: "#2a302b",
                            lineWidth: 1,
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Time delta',
                            color: '#911',
                            font: {
                                family: 'Comic Sans MS',
                                size: 20,
                                weight: 'bold',
                                lineHeight: 1.2,
                            },
                            padding: {top: 20, left: 0, right: 0, bottom: 0}
                        },
                        offset: true,
                        ticks: {
                            callback: function (val: number, index: number) {
                                return formatTimeDuration(val);
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        };
        if (chart !== null) {
            chart.destroy();
        }
        // @ts-ignore
        chart = new Chart(ctx, config);
    }), []);

    return <>
        <div className={classes.chartContainer}>
            <canvas id="trace-chart">No canvas</canvas>
        </div>
        <div style={{marginLeft: 10, padding: 20, display: "flex", flexDirection: "column", gap: "25px"}}>
            <FormControl fullWidth size="small">
                <InputLabel id="pair-type-label">Pair type</InputLabel>
                <Select
                    id="pair-type-select"
                    value={datasourceStore.currentFileStore.regularityKPIStore.currentPairType}
                    label="Pair type"
                    onChange={action((event: SelectChangeEvent<PairType>) => {
                        datasourceStore.currentFileStore.regularityKPIStore.currentPairType = event.target.value as PairType
                    })}
                >
                    <MenuItem value={PairType.START_START}>Start-Start (Directly follow event)</MenuItem>
                    <MenuItem value={PairType.START_COMPLETE}>Start-Complete</MenuItem>
                    <MenuItem value={PairType.BEGIN_END}>Begin-End</MenuItem>
                </Select>
            </FormControl>
            <Typography>Number of pairs:</Typography>
            <ul>
                {Array.from((datasourceStore.currentFileStore.regularityKPIStore.currentPair ?? new Map()).entries()).map(entry => {
                    return <li key={entry[0]}>{entry[0]} : {entry[1].length}</li>;
                })}
            </ul>
        </div>
    </>;
})
