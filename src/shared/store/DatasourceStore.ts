import {action, computed, makeObservable, observable, trace} from "mobx";
import {FileStore} from "./FileStore";

class DatasourceStore {
    @observable
    currentDataSource : string = "printer";
    @observable
    fileStoreMap: Map<string, FileStore> = new Map<string, FileStore>()
    constructor() {
        makeObservable(this)
        this.fileStoreMap.set("printer", new FileStore());
    }

    @computed
    get availableSources() {
        return Array.from(this.fileStoreMap.keys());
    }

    @action
    addNewDataSource(name: string) {
        this.fileStoreMap.set(name, new FileStore());
    }

    @computed
    get currentFileStore() : FileStore{
        trace()
        return this.fileStoreMap.get(this.currentDataSource)!!;
    }
}

export const datasourceStore = new DatasourceStore();