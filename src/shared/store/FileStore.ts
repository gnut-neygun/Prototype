import {action, IObservableArray, makeObservable, observable, runInAction} from "mobx";
import {EventLog} from "../../algorithm/parser/XESModels";
import {parseXesFromStrings} from "../../algorithm/parser/XESParser";
import {SimulKPIStore} from "./SimulKPIStore";
import {GraphDataStore} from "./GraphDataStore";
import {requestHeuristicMiner} from "../server_api/api";
import {GraphType} from "../server_api/types";
import {generateGraphDataList} from "../GraphVizDataParser";

export class FileStore {

    @observable
    public fileList: FileList | null = null
    @observable
    public mergedLog: EventLog = []
    @observable
    lifecycleOption: string[] = ["start"]
    @observable
    contentList: string[] & IObservableArray = [] as unknown as (string[] & IObservableArray)

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
            this.contentList.clear();
            for (let file of this.fileList) {
                const content = await file.text();
                this.contentList.push(content);
            }
            runInAction(() => {
                this.mergedLog = parseXesFromStrings(...this.contentList)
            });
        }
    }

    @action
    async requestGvizData() {
        const response = await requestHeuristicMiner(GraphType.heuristic_net, ...this.contentList);
        console.log(response);
        const elements = generateGraphDataList(response.data.data);
        this.graphDataStore.setElements(elements);
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