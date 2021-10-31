import {XesEvent} from "../../algorithm/parser/XESModels";
import {fastDiscoverSimultaneousIsc} from "../../algorithm/SimulConstraint";
import {action, computed, IReactionDisposer, makeObservable, observable, reaction, runInAction, trace} from "mobx";
import {generateRandomColor} from "../../utilities/colorGenerator";
import {FileStore} from "./FileStore";
import {datasourceStore} from "./DatasourceStore";
import {groupBy} from "../../utilities/utilities";

type ChartJSDataSet = { backgroundColor: string, data: { x: number, y: number }[], label: string }[]

export class SimulKPIStore {
    @observable
    constraint: ReturnType<typeof fastDiscoverSimultaneousIsc> = new Map()
    @observable
    timeDeltaInSec: number = 0.1
    @observable
    relativeEventOccurence: number = 0.95

    activitiesName: string[] = []

    @observable
    traceNameList: string[] = []
    @observable
    absoluteOccurenceMap: Map<string, XesEvent[]> = new Map()

    @observable
    traceFilterName: string | undefined

    /**
     * Map activities cluster to a color for use in visualisation
     * @private
     */
    private simulColorMap: Map<string, string> = new Map()

    constructor(private fileStore: FileStore) {
        makeObservable(this)
        this.dispose = reaction(() => [fileStore.mergedLog, this.relativeEventOccurence, this.timeDeltaInSec] as const, () => {
            this.computeConstraint();
            this.activitiesName = this.computeActivitiesName();
            runInAction(() => {
                this.traceNameList = this.filteredLog.map(trace => trace.name())
            });
            this.computeAbsoluteOccurenceMap()
        })
    }

    public dispose: IReactionDisposer;

    @computed({keepAlive: true})
    get filteredLog() {
        trace()
        return datasourceStore.currentFileStore.mergedLog.map(trace => trace.cloneWithFilter(event => datasourceStore.currentFileStore.lifecycleOption.includes(event.lifecycle() ?? "undefined")));
    }

    private computeActivitiesName(): string[] {
        const stringArrayWithDuplicates = Array.from(this.constraint.keys()).map(stringKey => stringKey.split(";")).flat()
        return Array.from(new Set(stringArrayWithDuplicates))
    }

    @action
    computeConstraint() {
        this.constraint = fastDiscoverSimultaneousIsc(this.fileStore.mergedLog, this.timeDeltaInSec, this.relativeEventOccurence, this.fileStore.lifecycleOption);
        console.log("Computed Simultaneous constraint: ");
        console.log(this.constraint)

        //Generate color for each activity cluster
        const map = new Map();
        const array = Array.from(this.constraint.keys())
        const colors = generateRandomColor(array.length)
        let i = 0
        for (let key of this.constraint.keys()) {
            const activityString = key.split(";").sort().join(",");
            map.set(activityString, colors[i])
            i++;
        }
        this.simulColorMap = map;
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

    @computed({keepAlive: true})
    get eventDistributionPlotData(): ChartJSDataSet {
        trace();
        const dataSetArray = [];
        debugger;
        const currentTrace = this.filteredLog.find(trace => this.traceFilterName === undefined ? true : this.traceFilterName.includes(trace.name()) && this.traceFilterName.length === trace.name().length)//Need to do this instead of === because this.traceFilterName is an observable
        if (currentTrace === undefined)
            return [];
        const traceGroupedByActivity = groupBy(currentTrace.events, event => event.name())
        const entries = Object.entries(traceGroupedByActivity)
        const colors = generateRandomColor(entries.length)
        let colorIndex = -1;
        return entries.map(
            entry => {
                const [activity, eventList] = entry
                return {
                    label: activity,
                    data: eventList.map(event => {
                        return {
                            x: event.time().valueOf(),
                            y: 5,
                            event: event
                        }
                    }),
                    backgroundColor: colors[++colorIndex]
                }
            }
        );
    }

    @computed({keepAlive: true})
    get clusterDistributionData() {
        const colors= generateRandomColor(Array.from(this.constraint.keys()).length)
        let colorIndex = -1;
        return Array.from(this.constraint.entries()).map(entry => {
            const [name, clusters]=entry
            return {
                label: name,
                data: clusters.map(cluster => {

                    return {
                        x: new Date(cluster[Math.floor(cluster.length / 2)].time()),
                        y: Math.random() * 10,
                        r: cluster.length / 5,
                        cluster: cluster,
                    }
                }),
                backgroundColor: colors[++colorIndex]
            }
        })
    }

    @computed({keepAlive: true})
    get simultaneousNodes() : string[][]{
        return Array.from(this.constraint.keys()).map(string => string.split(";").sort());
    }

    public getColorFor(simulCluster: string[]): string {
        const clusterString=simulCluster.sort().join(",");
        return this.simulColorMap.get(clusterString) ?? 'black'
    }
}