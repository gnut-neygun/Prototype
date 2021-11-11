import {IReactionDisposer, makeObservable, observable, runInAction} from "mobx";
import {FileStore} from "./FileStore";
import {EventPair} from "../../algorithm/ContrainedExecution";
import {requestDataConstraint} from "../server_api/api";

export class DataKPIStore {
    @observable
    constraint: Record<string, any>

    constructor(private fileStore: FileStore) {
        makeObservable(this)
    }

    public initiateConstraintRecompute() {
        const currentPair = this.fileStore.regularityKPIStore.currentPair ?? new Map()
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


    public dispose: IReactionDisposer;

    private serializeCurrentPair(pairMap: Map<string, EventPair[]>): string {
        const jsObject = Array.from(pairMap.entries());
        return JSON.stringify(jsObject, (key, value) => {
            if (key === "trace") return undefined //don't serialize trace to avoid cyclic reference
            return value;
        })
    }
}