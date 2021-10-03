import {action, computed, makeObservable, observable, runInAction, trace} from "mobx";
import {FileStore} from "./FileStore";
import {PrinterGraphData} from "../PrinterGraphData";
import {generateGraphDataList} from "../graphDataSlice";

class DatasourceStore {
    @observable
    currentDataSource : string = "printer";
    @observable
    fileStoreMap: Map<string, FileStore> = new Map<string, FileStore>()
    constructor() {
        makeObservable(this)
        this.fileStoreMap.set("printer", new FileStore());
        runInAction(() => {
            this.currentFileStore.graphDataStore.elements = generateGraphDataList(PrinterGraphData)
            this.currentFileStore.graphDataStore.setSelectedSimultaneousNodes([["deliver bill", "deliver poster", "deliver flyer"]])
        });
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