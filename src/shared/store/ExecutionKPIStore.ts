import {computed, IReactionDisposer, makeObservable, observable, reaction, runInAction} from "mobx";
import {FileStore} from "./FileStore";
import {XesEvent} from "../../algorithm/parser/XESModels";
import {detectExecutionConstraint} from "../../algorithm/ContrainedExecution";

type ChartJSDataSet= {backgroundColor: string, data: {x: number, y: number}[], label: string}[]

export class ExecutionKPIStore {
    @observable
    constraint: Map<string, XesEvent[]> = new Map()
    @observable
    colorHue: number = 30
    @observable
    relativeEventOccurence: number = 0.95
    @observable
    perTime: "day" | "month" = "day"
    @observable
    perYear: number | undefined
    @observable
    perActivity: string = ""
    @observable
    perResource: string = ""

    constructor(private fileStore: FileStore) {
        makeObservable(this)
        this.dispose = reaction(() => [fileStore.mergedLog, this.relativeEventOccurence, this.perTime, this.perActivity, this.perResource] as const, () => {
            //Build grouping function
            const groupFunction = (event: XesEvent) => {
                const time = new Date(event.time())
                const day = time.getDate();
                const month = time.getMonth();
                const year = time.getFullYear();
                if (this.perTime === "day") {
                    return `${day},${month},${year},${this.perActivity === "" ? "" : event.name()},${this.perResource === "" ? "" : event.resource()}`;
                } else {
                    return `,${month},${year},${this.perActivity === "" ? "" : event.name()},${this.perResource === "" ? "" : event.resource()}`;
                }
            };
            runInAction(() => {
                this.constraint = detectExecutionConstraint(fileStore.sortedEventList, this.relativeEventOccurence, groupFunction)
                this.perYear = this.yearList[0];
                console.log("Computed execution constraint: ")
                console.log(this.constraint)
            });
        })
    }

    public dispose: IReactionDisposer;

    @computed({keepAlive: true})
    get yearList() {
        const yearArrayWithDuplicates = this.fileStore.sortedEventList.map(event => {
            const date = new Date(event.time());
            return date.getFullYear()
        })
        return [...new Set(yearArrayWithDuplicates)]
    }

    getEventListForDate(month: number, day?: number): XesEvent[] | undefined {
        return this.constraint.get(`${day ?? ""},${month},${this.perYear},${this.perActivity},${this.perResource}`)
    }

    @computed({keepAlive: true})
    get heatMapData() {
        const dataArray = [];
        let maxV = 0;
        for (let month = 0; month < 12; month++) {
            let endDay = 31;
            if (month === 2) {
                endDay = 29;
            }
            else if (month % 2 === 0) {
                endDay = 31
            }
            else if (month % 2 === 1) {
                endDay = 30;
            }
            for (let day=0; day< endDay; day++){
                const value = this.constraint.get(`${day},${month},${this.perYear},${this.perActivity},${this.perResource}`)?.length ?? 0;
                if (value > maxV) {
                    maxV = value;
                }
                dataArray.push({x: day, y: month, v: value});
            }
        }
        const data = {
            datasets: [{
                label: 'My Matrix',
                data: dataArray,
                backgroundColor: (context: any) => {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = (value - 5) / 40;
                    //Provide a default value in case there is nothing initialized for more pleasing look
                    if (this.constraint.size === 0)
                        return `hsl(${this.colorHue}, 50%, 50%`
                    return `hsl(${this.colorHue}, 50%, ${((1 - value / maxV) * 100).toFixed(2)}%)`;
                },
                borderColor: (context: any) => {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = (value - 5) / 40;
                    return `hsl(${this.colorHue}, 50%, 100%)`
                },
                borderWidth: 1,
                width: ({chart}: any) => (chart.chartArea || {}).width / 31 - 1,
                height: ({chart}: any) => (chart.chartArea || {}).height / 12 - 1
            }]
        };
        return data;
    }

    @computed({keepAlive: true})
    get barChartData() {
        const dataArray = [];
        for (let month = 0; month < 12; month++) {
            const value = this.constraint.get(`,${month},${this.perYear},${this.perActivity},${this.perResource}`)?.length ?? 0;
            dataArray.push({x: month.toString(), y: value, v: value});
        }
        const data = {
            datasets: [{
                backgroundColor: `hsl(${this.colorHue}, 50%, 50%`,
                label: 'My Matrix',
                data: dataArray,
            }]
        };
        return data;
    }
}