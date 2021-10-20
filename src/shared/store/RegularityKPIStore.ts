import {action, IReactionDisposer, makeObservable, observable, reaction, runInAction} from "mobx";
import {FileStore} from "./FileStore";
import {createPairs, detectRegularities, PairDict} from "../../algorithm/ContrainedExecution";

export class RegularityKPIStore {
    @observable
    pairs: ReturnType<typeof createPairs> = []
    @observable
    currentPair: PairDict = new Map();
    @observable
    constraint: ReturnType<typeof detectRegularities> = new Map()
    @observable
    relativeEventOccurence: number | undefined =0.95
    @observable
    timeDeltaInMilis: number | undefined = 600_000

    constructor(private fileStore: FileStore) {
        makeObservable(this)
        this.dispose=reaction(() => [fileStore.mergedLog, this.relativeEventOccurence, this.timeDeltaInMilis] as const, ([mergedLog, relativeOccurence]) => {
            runInAction(() => {
                this.pairs = createPairs(mergedLog)
                this.currentPair = this.pairs[1]
            });
            this.updateConstraint();
        })
    }

    public dispose: IReactionDisposer;

    @action
    updateConstraint() {
        this.constraint = detectRegularities(this.currentPair, this.relativeEventOccurence, this.timeDeltaInMilis);
    }
}