import {action, makeObservable, observable, runInAction} from "mobx";
import {EventLog} from "../../algorithm/parser/XESModels";
import {parseXesFromStrings} from "../../algorithm/parser/XESParser";
import {SimulKPIStore} from "./SimulKPIStore";
import {GraphDataStore} from "./GraphDataStore";

export class FileStore {

    @observable
    public fileList: FileList | null = null
    @observable
    public mergedLog: EventLog = []
    @observable
    lifecycleOption: string[] = ["start"]

    simulKPIStore: SimulKPIStore
    graphDataStore: GraphDataStore

    constructor() {
        makeObservable(this);
        //Make sure these are called after makeObservable
        this.simulKPIStore = new SimulKPIStore(this);
        this.graphDataStore = new GraphDataStore(this);
    }

    @action
    setFileList(fileList: FileList | null) {
        this.fileList = fileList;
    }

    @action
    async updateMergedLog() {
        if (this.fileList === null) {
            this.mergedLog = [];
        } else {
            const contentList: string[]=[]
            for (let file of this.fileList) {
                const content = await file.text();
                contentList.push(content);
            }
            runInAction(() => {
                this.mergedLog = parseXesFromStrings(...contentList)
            });
        }
    }

    @action
    /**
     * Used for testing purpose
     * @param log
     */
    setMergedLog(log: EventLog) {
        this.mergedLog = log;
    }
}