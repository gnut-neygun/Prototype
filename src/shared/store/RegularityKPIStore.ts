import {action, computed, IReactionDisposer, makeObservable, observable, reaction} from "mobx";
import {FileStore} from "./FileStore";
import {createPairs, detectRegularities} from "../../algorithm/ContrainedExecution";
import {datasourceStore} from "./DatasourceStore";
import {generateRandomColor} from "../../utilities/colorGenerator";
import {formatTimeDuration, getMean, getStandardDeviation} from "../../utilities/utilities";

export enum PairType {
    BEGIN_END, START_START, START_COMPLETE
}
export class RegularityKPIStore {
    @observable
    pairs: ReturnType<typeof createPairs> = []
    @observable
    currentPairType: PairType = PairType.START_START
    @observable
    constraint: Map<PairType, Record<string, boolean>> = new Map()
    @observable
    relativeEventOccurence: number = 0.95
    @observable
    timeDeltaInMilis: number = 600_000
    @observable
    selectedActivityName: string | undefined

    constructor(private fileStore: FileStore) {
        makeObservable(this)
        this.dispose = reaction(() => [fileStore.mergedLog] as const, this.initiateConstraintRecompute.bind(this))
        reaction(() => [this.relativeEventOccurence, this.timeDeltaInMilis], this.updateTooltips.bind(this))
    }

    @action
    initiateConstraintRecompute() {
        this.pairs = createPairs(this.fileStore.mergedLog)
        this.updateConstraint();
        this.updateTooltips();
    }


    public dispose: IReactionDisposer;

    @computed
    get activityPairList(): string[] {
        if (this.currentConstraint === undefined) {
            return []
        }
        return Object.keys(this.currentConstraint)
    }

    @action
    setCurrentPairType(type: PairType) {
        this.currentPairType = type;
        if (window.location.pathname === "/")
            //refresh the edges
            datasourceStore.currentFileStore.graphDataStore.toggleRegularityEdge();
        datasourceStore.currentFileStore.graphDataStore.toggleRegularityEdge();
    }

    @action
    updateConstraint() {
        this.constraint.set(PairType.BEGIN_END, detectRegularities(this.pairs[PairType.BEGIN_END.valueOf()], this.relativeEventOccurence, this.timeDeltaInMilis));
        this.constraint.set(PairType.START_START, detectRegularities(this.pairs[PairType.START_START.valueOf()], this.relativeEventOccurence, this.timeDeltaInMilis));
        this.constraint.set(PairType.START_COMPLETE, detectRegularities(this.pairs[PairType.START_COMPLETE.valueOf()], this.relativeEventOccurence, this.timeDeltaInMilis));
        console.log("Computed regularity constraint: ");
        console.log(this.constraint);
    }

    private updateTooltips() {
        const cy = datasourceStore.currentFileStore.graphDataStore.cytoscapeReference
        if (window.location.pathname !== "/") {
            datasourceStore.currentFileStore.graphDataStore.pendingTasks.push(this.updateTooltips.bind(this))
            return;
        }
        if (cy === null || datasourceStore.currentFileStore.graphDataStore.isLoading) {
            console.log("Loading graph data, setting tooltip later.")
            setTimeout(this.updateTooltips.bind(this), 1000);
            return;
        }
        const regResult = detectRegularities(this.pairs[PairType.START_COMPLETE.valueOf()], this.relativeEventOccurence) as unknown as Record<string, number>;
        const regResult2 = detectRegularities(this.pairs[PairType.START_COMPLETE.valueOf()], undefined, this.timeDeltaInMilis)
        const activityToTooltipString = new Map<string, string[]>();
        for (let entry of Object.entries(regResult)) {
            const activity = entry[0].split(",")[0];
            const duration = entry[1];
            activityToTooltipString.pushIntoKey(activity, `${(this.relativeEventOccurence * 100).toFixed()}% of events finished within ${duration / 1000} seconds`)
        }

        for (let entry of Object.entries(regResult2)) {
            const activity = entry[0].split(",")[0];
            const percentile = entry[1] as unknown as number;
            activityToTooltipString.pushIntoKey(activity, `${(percentile * 100).toFixed()}% of events finished within ${this.timeDeltaInMilis / 1000} seconds`)
        }
        for (let [key, value] of activityToTooltipString.entries()) {
            const tooltipString = value.join("<br/>")
            datasourceStore.currentFileStore.graphDataStore.setElementTooltip(key, tooltipString)
        }
    }

    @computed
    get currentConstraint(): Record<string, boolean> | undefined {
        return this.constraint.get(this.currentPairType)
    }

    @computed
    get currentPair() {
        if (this.pairs.length === 0) {
            return undefined
        }
        return this.pairs[this.currentPairType.valueOf()];
    }

    @computed
    get pairStatistics(): Map<string, string> {
        const returnMap = new Map()
        const activityName = this.selectedActivityName !!
        if (this.pairs.length === 0)
            return returnMap;
        const pairArray = this.pairs[this.currentPairType.valueOf()].get(activityName)!!;
        returnMap.set("Number of pairs", pairArray.length);
        returnMap.set("Pair mean duration", formatTimeDuration(getMean(pairArray.map(pair => pair[2]))))
        returnMap.set("Pair standard deviation of duration", formatTimeDuration(getStandardDeviation(pairArray.map(pair => pair[2]))))
        return returnMap;
    }

    @computed({keepAlive: true})
    get traceChartData() {
        if (this.pairs.length === 0)
            return;
        const currentPair = this.pairs[this.currentPairType.valueOf()];
        if (currentPair === undefined) {
            return;
        }
        const colors = generateRandomColor(currentPair.size)
        let colorIndex = 0;
        const dataset = Array.from(currentPair.entries()).filter(entry => this.selectedActivityName === undefined ? true : (entry[0].length === this.selectedActivityName.length && this.selectedActivityName.includes(entry[0]))).map(
            entry => {
                const [name, events] = entry;
                return {
                    label: name,
                    data: events.map(event => {
                        return {
                            x: event[0].time(),
                            y: event[2],
                            eventPair: event
                        }
                    }),
                    backgroundColor: colors[colorIndex++]
                }
            }
        );
        return dataset;
    }
}