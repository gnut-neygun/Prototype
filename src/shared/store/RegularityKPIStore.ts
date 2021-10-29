import {action, computed, IReactionDisposer, makeObservable, observable, reaction, runInAction} from "mobx";
import {FileStore} from "./FileStore";
import {createPairs, detectRegularities} from "../../algorithm/ContrainedExecution";
import {datasourceStore} from "./DatasourceStore";

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

    constructor(private fileStore: FileStore) {
        makeObservable(this)
        this.dispose=reaction(() => [fileStore.mergedLog, this.relativeEventOccurence, this.timeDeltaInMilis] as const, ([mergedLog, relativeOccurence]) => {
            runInAction(() => {
                this.pairs = createPairs(mergedLog)
            });
            this.updateConstraint();
            this.updateTooltips();
        })
    }

    public dispose: IReactionDisposer;

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
        if (cy === null || datasourceStore.currentFileStore.graphDataStore.isLoading) {
            console.log(datasourceStore.currentFileStore.graphDataStore.isLoading)
            setTimeout(this.updateTooltips.bind(this), 200)
            return;
        }
        const regResult = detectRegularities(this.pairs[PairType.START_COMPLETE.valueOf()], this.relativeEventOccurence) as unknown as Record<string, number>;
        for (let entry of Object.entries(regResult)) {
            const activity = entry[0].split(",")[0];
            const duration = entry[1];
            datasourceStore.currentFileStore.graphDataStore.setElementTooltip(activity, `${(this.relativeEventOccurence * 100).toFixed()}% of events finished within ${duration / 1000} seconds`)
        }
        console.log(regResult);
    }

    @computed
    get currentConstraint(): Record<string, boolean> | undefined {
        return this.constraint.get(this.currentPairType)
    }
}