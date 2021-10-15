import {fastDiscoverSimultaneousIsc} from "../../algorithm/SimulConstraint";
import {computed, IReactionDisposer, makeObservable, observable, reaction} from "mobx";
import {FileStore} from "./FileStore";

type ChartJSDataSet= {backgroundColor: string, data: {x: number, y: number}[], label: string}[]

export class ExecutionKPIStore {
    @observable
    constraint: ReturnType<typeof fastDiscoverSimultaneousIsc> = new Map()
    @observable
    colorHue: number=30
    @observable
    relativeEventOccurence: number=0.95
    @observable
    maxCount = 33;

    constructor(private fileStore: FileStore) {
        makeObservable(this)
        this.dispose=reaction(() => [fileStore.mergedLog, this.relativeEventOccurence] as const, () => {

        })
    }

    public dispose: IReactionDisposer;

    @computed
    get heatMapData() {
        // return Array.from(this.absoluteOccurenceMap.entries()).map(
        //     entry => {
        //         const [name, events] = entry;
        //         return {
        //             label: name,
        //             data: events.map(event => {
        //                 const y = Math.random() * 10;
        //                 return {
        //                     x: event.time().valueOf(),
        //                     y: y
        //                 }
        //             }),
        //             backgroundColor: colors[++colorIndex]
        //         }
        //     }
        // );
        const data = {
            datasets: [{
                label: 'My Matrix',
                data: [
                    {x: 1, y: 1, v: 11},
                    {x: 1, y: 2, v: 12},
                    {x: 1, y: 3, v: 13},
                    {x: 2, y: 1, v: 21},
                    {x: 2, y: 2, v: 22},
                    {x: 2, y: 3, v: 23},
                    {x: 3, y: 1, v: 31},
                    {x: 3, y: 2, v: 32},
                    {x: 3, y: 3, v: 33}
                ],
                backgroundColor: (context: any) => {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = (value - 5) / 40;
                    return `hsl(${this.colorHue}, 50%, ${((1-value/this.maxCount)*100).toFixed(2)}%)`;
                },
                borderColor: (context: any) => {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = (value - 5) / 40;
                    return `hsl(${this.colorHue}, 50%, 100%)`
                },
                borderWidth: 1,
                width: ({chart}: any) => (chart.chartArea || {}).width / 3 - 1,
                height: ({chart}: any) =>(chart.chartArea || {}).height / 3 - 1
            }]
        };
        return data;
    }
}