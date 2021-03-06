import {Theme} from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Chart from 'chart.js/auto';
import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {action, autorun} from "mobx";
import {datasourceStore} from "../../../shared/store/DatasourceStore";
import de from "date-fns/locale/de";
import {XesEvent} from "../../../algorithm/parser/XESModels";
import {Autocomplete, TextField, Typography} from "@mui/material";
import {formatTimeDuration} from "../../../utilities/utilities";

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
                plugins: {
                    title: {
                        display: true,
                        text: 'Event Time Distribution',
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
                                return datetime.toLocaleString()
                            },
                            label: function(context: any) {
                                const event: XesEvent = context.raw.event
                                return [`Instance: ${event.instance()}`, `Activity: ${event.name()}`, `Lifecycle: ${event.lifecycle()}`, `Resource: ${event.resource()}`]
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display:true,
                        title: {
                            display: true,
                            text: 'Time',
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
                        display: false
                    }
                }
            },
        };
        if (chart !== null) {
            chart.destroy();
        }
        // @ts-ignore
        chart = new Chart(ctx, config);
    }), []);
    return <>
        <div className={classes.chartContainer}>
            <canvas id="chart">No canvas</canvas>
        </div>
        <div style={{marginLeft: 10, padding: 20, display: "flex", flexDirection: "column", gap: "25px"}}>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={datasourceStore.currentFileStore.simulKPIStore.traceNameList}
                sx={{width: 300}}
                value={datasourceStore.currentFileStore.simulKPIStore.traceFilterName ?? null}
                onChange={action((event: any, newValue: string | null) => {
                    if (newValue === null)
                        datasourceStore.currentFileStore.simulKPIStore.traceFilterName = undefined
                    else
                        datasourceStore.currentFileStore.simulKPIStore.traceFilterName = newValue;
                })}
                renderInput={(params) => <TextField {...params} label="Trace filter"/>}
            />
            <Typography>Trace
                duration: {formatTimeDuration(datasourceStore.currentFileStore.simulKPIStore.traceDuration ?? 0)}</Typography>
            <Typography>Number of events in
                trace: {datasourceStore.currentFileStore.simulKPIStore.currentTrace?.events?.length ?? 0}</Typography>
        </div>
    </>
})
