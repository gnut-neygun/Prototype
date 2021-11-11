import {action, makeObservable, observable, reaction, runInAction} from "mobx";
import {FileStore} from "./FileStore";
import {EventPair} from "../../algorithm/ContrainedExecution";
import {requestDataConstraint} from "../server_api/api";
import {PairType} from "./RegularityKPIStore";

export class DataKPIStore {
    @observable
    constraint: Record<string, any>
    @observable
    currentPairType: PairType = PairType.START_START

    constructor(private fileStore: FileStore) {
        makeObservable(this)
        reaction(() => [fileStore.regularityKPIStore.pairs, this.currentPairType], this.initiateConstraintRecompute.bind(this))
    }

    public initiateConstraintRecompute() {
        if (this.fileStore.regularityKPIStore.pairs.length === 0)
            return;
        const currentPair = this.fileStore.regularityKPIStore.pairs[this.currentPairType.valueOf()];
        const serializedString = this.serializeCurrentPair(currentPair);
        requestDataConstraint(serializedString, this.fileStore.mergeAttribute ?? "").then(r => {
            console.log("Computed data constraint from server: ")
            console.log(r);
            runInAction(() => {
                    this.constraint = r.data
                }
            );
        });
    }

    private serializeCurrentPair(pairMap: Map<string, EventPair[]>): string {
        const jsObject = Array.from(pairMap.entries());
        return JSON.stringify(jsObject, (key, value) => {
            if (key === "trace") return undefined //don't serialize trace to avoid cyclic reference
            return value;
        })
    }

    @action
    setCurrentPairType(type: PairType) {
        this.currentPairType = type;
    }
}