import {action, computed, IReactionDisposer, makeObservable, observable, reaction, runInAction} from "mobx";
import {FileStore} from "./FileStore";
import {createPairs, detectRegularities} from "../../algorithm/ContrainedExecution";

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

    @computed
    get currentConstraint(): Record<string, boolean> | undefined {
        return this.constraint.get(this.currentPairType)
    }
}