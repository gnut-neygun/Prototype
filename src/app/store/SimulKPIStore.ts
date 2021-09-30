import {EventLog, XesEvent} from "../../algorithm/parser/XESModels";
import {fastDiscoverSimultaneousIsc} from "../../algorithm/SimulConstraint";
import {action, autorun, computed, makeObservable, observable, trace} from "mobx";
import {fileStore} from "./FileStore";
import {generateRandomColor} from "../../Utilities";

type ChartJSDataSet= {backgroundColor: string, data: {x: number, y: number}[], label: string}[]

export class SimulKPIStore {
    constraint: ReturnType<typeof fastDiscoverSimultaneousIsc> = new Map()
    @observable
    timeDeltaInSec: number=0.1
    @observable
    relativeEventOccurence: number=0.95

    activitiesName: string[] = []
    filteredLog: EventLog = []

    @observable
    absoluteOccurenceMap: Map<string, XesEvent[]> = new Map()

    constructor() {
        makeObservable(this)
        autorun(() => {
            this.constraint = fastDiscoverSimultaneousIsc(fileStore.mergedLog, this.timeDeltaInSec, this.relativeEventOccurence, fileStore.lifecycleOption);
            this.activitiesName = this.computeActivitiesName();
            this.filteredLog=fileStore.mergedLog.map(trace => trace.cloneWithFilter(event => fileStore.lifecycleOption.includes(event.lifecycle())));
            this.computeAbsoluteOccurenceMap()
        });
    }

    private computeActivitiesName(): string[] {
         const stringArrayWithDuplicates=Array.from(this.constraint.keys()).map(stringKey => stringKey.split(";")).flat()
        return Array.from(new Set(stringArrayWithDuplicates))
    }

    @action
    computeAbsoluteOccurenceMap() {
        const map=new Map<string, XesEvent[]>()
        for (let activityName of this.activitiesName) {
            map.set(activityName, []);
        }
        for (let trace of this.filteredLog) {
            for (let event of trace.events) {
                if (this.activitiesName.includes(event.name()))
                    map.get(event.name())!!.push(event)
            }
        }
        this.absoluteOccurenceMap = map;
    }

    @computed
    get dataSets(): ChartJSDataSet {
        trace();
        console.log("Computing chartjs datasets")
        const colors= generateRandomColor(simulKPIStore.absoluteOccurenceMap.size)
        let colorIndex = -1;
        return Array.from(simulKPIStore.absoluteOccurenceMap.entries()).map(
            entry => {
                const [name, events] = entry;
                return {
                    label: name,
                    data: events.map(event => {
                        const y = Math.random() * 10;
                        return {
                            x: event.time().valueOf(),
                            y: y
                        }
                    }),
                    backgroundColor: colors[++colorIndex]
                }
            }
        );
    }
}

export const simulKPIStore = new SimulKPIStore();