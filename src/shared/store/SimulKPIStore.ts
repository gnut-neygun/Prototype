import {EventLog, XesEvent} from "../../algorithm/parser/XESModels";
import {fastDiscoverSimultaneousIsc} from "../../algorithm/SimulConstraint";
import {action, computed, IReactionDisposer, makeObservable, observable, reaction, trace} from "mobx";
import {generateRandomColor} from "../../utilities/colorGenerator";
import {FileStore} from "./FileStore";

type ChartJSDataSet= {backgroundColor: string, data: {x: number, y: number}[], label: string}[]

export class SimulKPIStore {
    @observable
    constraint: ReturnType<typeof fastDiscoverSimultaneousIsc> = new Map()
    @observable
    timeDeltaInSec: number=0.1
    @observable
    relativeEventOccurence: number=0.95

    activitiesName: string[] = []
    filteredLog: EventLog = []

    @observable
    absoluteOccurenceMap: Map<string, XesEvent[]> = new Map()

    constructor(private fileStore: FileStore) {
        makeObservable(this)
        this.dispose=reaction(() => [fileStore.mergedLog, this.relativeEventOccurence, this.timeDeltaInSec] as const, () => {
            this.computeConstraint();
            this.activitiesName = this.computeActivitiesName();
            this.filteredLog=fileStore.mergedLog.map(trace => trace.cloneWithFilter(event => fileStore.lifecycleOption.includes(event.lifecycle() ?? "undefined")));
            this.computeAbsoluteOccurenceMap()
        })
    }

    public dispose: IReactionDisposer;

    private computeActivitiesName(): string[] {
         const stringArrayWithDuplicates=Array.from(this.constraint.keys()).map(stringKey => stringKey.split(";")).flat()
        return Array.from(new Set(stringArrayWithDuplicates))
    }

    @action
    computeConstraint() {
        this.constraint= fastDiscoverSimultaneousIsc(this.fileStore.mergedLog, this.timeDeltaInSec, this.relativeEventOccurence, this.fileStore.lifecycleOption);
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
    get eventDistributionPlotData(): ChartJSDataSet {
        trace();
        const colors= generateRandomColor(this.absoluteOccurenceMap.size)
        let colorIndex = -1;
        return Array.from(this.absoluteOccurenceMap.entries()).map(
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

    @computed
    get clusterDistributionData() {
        const colors= generateRandomColor(Array.from(this.constraint.keys()).length)
        let colorIndex = -1;
        return Array.from(this.constraint.entries()).map(entry => {
            const [name, clusters]=entry
            return {
                label: name,
                data: clusters.map(cluster => {

                    return {
                        x: new Date(cluster[Math.floor(cluster.length/2)].time()),
                        y: cluster.length,
                    }
                }),
                backgroundColor: colors[++colorIndex]
            }
        })
    }

    @computed
    get simultaneousNodes() : string[][]{
        return Array.from(this.constraint.keys()).map(string => string.split(";"));
    }
}