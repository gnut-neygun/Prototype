import Chart from 'chart.js/auto';
import {useEffect, useState} from "react";
import {MatrixController, MatrixElement} from "chartjs-chart-matrix";
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Slider,
    Stack,
    Typography
} from "@mui/material";
import {Palette} from "@mui/icons-material";
import {observer} from "mobx-react-lite";
import {action, autorun} from "mobx";
import {datasourceStore} from "../../../shared/store/DatasourceStore";
import styled from "@emotion/styled";
import EnhancedTable from "../../../shared/XesEventTableComponent";
import {numberMonthArrayMapping} from "../../../shared/NumberToMonth";

const ContainerDiv=styled.div`
                padding: 10px;
                margin-top: 45px;
                position: relative;
                height: 40vh;
                width: 80vw;
                display: flex;
                flex-direction: column;
`
let chart: Chart | null = null;
export const ExecutionKPI = observer(() => {
    const executionKPIStore = datasourceStore.currentFileStore.executionKPIStore
    //Count from 0, [month,day]
    const [clickedDay, setClickedDay] = useState<[number,number]>([0,0])
    useEffect(() => autorun(() => {
        const ctx = document.getElementById('heatmap-chart') as HTMLCanvasElement;
        Chart.register(MatrixController, MatrixElement);
        const config = {
            type: 'matrix' as const,
            data: datasourceStore.currentFileStore.executionKPIStore.heatMapData,
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Execution Heat Map',
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
                    legend: false,
                    tooltip: {
                        callbacks: {
                            title(context: any) {
                                const v = context[0].raw;
                                return `${numberMonthArrayMapping[v.y-1]} ${v.x}`; //Minus one because we plus one when creating data for humans
                            },
                            label(context: any) {
                                const v = context.dataset.data[context.dataIndex];
                                return ['Number of events: ' + v.v];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        ticks: {
                            stepSize: 1
                        },
                        title: {
                            display: true,
                            text: 'Day',
                            color: '#191',
                            font: {
                                family: 'Comic Sans MS',
                                size: 20,
                                weight: 'bold',
                                lineHeight: 1.2
                            },
                            padding: {top: 30, left: 0, right: 0, bottom: 0}
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Month',
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
                            stepSize: 1
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                onClick: (event: any) => {
                    const data = event.chart.tooltip.dataPoints[0].parsed;
                    setClickedDay([data.y-1, data.x])
                },
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
    const [relValue, setRelValue] = useState<number>(executionKPIStore.relativeEventOccurence)

    function handleColorChange(event: any, newValue: number | number[]) {
        setColorValue(newValue as number);
    }

    function handleOccurenceChange(event: any, newValue: number | number[]) {
        setRelValue(newValue as number);
    }

    return <>
        <ContainerDiv>
            <canvas id="heatmap-chart">No canvas</canvas>
            <EnhancedTable data={executionKPIStore.getEventListForDate(...clickedDay) ?? []} title={`XES Event Table for ${numberMonthArrayMapping[clickedDay[0]]} ${clickedDay[1]}`}/>
        </ContainerDiv>
        <div style={{marginLeft: 10, padding: 20, display:"flex", flexDirection: "column", gap: "25px"}}>
            <Stack spacing={2} direction="row" sx={{mb: 1, width: 320, marginTop: 10}} alignItems="center">
                <Palette/>
                <Typography>Color</Typography>
                <Slider aria-label="color" value={colorValue} min={0} max={360} onChange={handleColorChange}
                        onMouseUp={action(() => {
                            executionKPIStore.colorHue = colorValue;
                        })}
                        valueLabelDisplay={"auto"}/>
            </Stack>
            <Stack spacing={2} direction="row" sx={{mb: 1, width: 320}} alignItems="center">
                <Palette/>
                <Typography>Relative occurence</Typography>
                <Slider aria-label="color" value={relValue} min={0} max={1} step={0.01} onChange={handleOccurenceChange}
                        onMouseUp={action(() => {
                            executionKPIStore.relativeEventOccurence = relValue;
                        })}
                        valueLabelDisplay={"auto"}/>
            </Stack>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="per-time">Per time</InputLabel>
                <Select
                    labelId="per-time"
                    id="per-time"
                    value={executionKPIStore.perTime}
                    label="Per time"
                    onChange={action((event: SelectChangeEvent) => {
                        executionKPIStore.perTime = event.target.value as "day"|"month"|"none";
                    })}
                >
                    <MenuItem key="day" value={"day"}>Day</MenuItem>
                    <MenuItem key="month" value={"month"}>Month</MenuItem>
                    <MenuItem key="none" value={"none"}>
                        <em>None</em>
                    </MenuItem>
                </Select>
                <FormHelperText>Per time</FormHelperText>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="per-activity">Per activity</InputLabel>
                <Select
                    labelId="per-activity"
                    id="per-activity"
                    value={executionKPIStore.perActivity === "" ? "none": executionKPIStore.perActivity}
                    label="Per activity"
                    onChange={action((event: SelectChangeEvent) => {
                        if (event.target.value === "none") {
                            executionKPIStore.perActivity=""
                        }
                        executionKPIStore.perActivity = event.target.value;
                    })}
                >
                    {Array.from(new Set(datasourceStore.currentFileStore.contentList.map(element => element.activities).flat())).map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
                    <MenuItem key="none" value={"none"}>
                        <em>None</em>
                    </MenuItem>
                </Select>
                <FormHelperText>Per activity</FormHelperText>
            </FormControl>
        </div>
    </>;
})
