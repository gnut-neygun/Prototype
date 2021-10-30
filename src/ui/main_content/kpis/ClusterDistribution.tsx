import {Theme} from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Chart from 'chart.js/auto';
import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {autorun} from "mobx";
import {datasourceStore} from "../../../shared/store/DatasourceStore";
import 'chartjs-adapter-date-fns';
import de from "date-fns/locale/de";
import {XesEvent} from "../../../algorithm/parser/XESModels";
import EnhancedTable from "../../../shared/XesEventTableComponent";

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
export const ClusterDistribution= observer(() => {
    console.log("Rerendering KPI Graphs");
    const [clickedCluster, setClickedCluster] = useState<XesEvent[]>([]);
    const [clickedTime, setClickedTime] = useState<Date>(new Date());
    const classes = useStyles();
    useEffect(() => autorun(() =>{
        const ctx = document.getElementById('boxplotChart') as HTMLCanvasElement;
        const data = {
            datasets: datasourceStore.currentFileStore.simulKPIStore.clusterDistributionData,
        };
        const config = {
            type: 'bubble' as const,
            data: data,
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Simultaneous Cluster Time Distribution',
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
                                const ret: string=
                                    `Events num: ${context.raw.cluster.length}`
                                return ret;
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
                },
                onClick: (event: any) => {
                    const data = event.chart.tooltip.dataPoints[0].raw;
                    setClickedCluster(data.cluster);
                    setClickedTime(data.x);
                },
            },
        };
        if (chart !== null) {
            chart.destroy();
        }
        // @ts-ignore
        chart = new Chart(ctx, config);
    }), []);
    return <>
        <div className={classes.chartContainer} >
            <canvas id="boxplotChart">No canvas</canvas>
            <EnhancedTable data={clickedCluster} title={clickedCluster.length===0 ? `XES Event Table` : `XES Event Table for cluster on ${clickedTime.toLocaleString()}`}/>
        </div>

    </>
})
