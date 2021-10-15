import {action, computed, IObservableArray, makeObservable, observable, runInAction, trace} from "mobx";
import {EventLog} from "../../algorithm/parser/XESModels";
import {parseXesFromStrings} from "../../algorithm/parser/XESParser";
import {SimulKPIStore} from "./SimulKPIStore";
import {GraphDataStore} from "./GraphDataStore";
import {requestHeuristicMiner} from "../server_api/api";
import {GraphType} from "../server_api/types";
import {generateGraphDataList} from "../GraphVizDataParser";
import {ExecutionKPIStore} from "./ExecutionKPIStore";
import {mergeTrace} from "../../algorithm/MergeTrace";
import {RegularityKPIStore} from "./RegularityKPIStore";

export class FileStore {

    @observable
    public fileList: FileList | null = null
    @observable
    public parsedLog: EventLog = []
    @observable
    lifecycleOption: string[] = ["start"]
    @observable
    contentList: string[] & IObservableArray = [] as unknown as (string[] & IObservableArray)
    @observable
    isMergeLog: boolean = false;
    simulKPIStore: SimulKPIStore
    executionKPIStore: ExecutionKPIStore
    regularityKPIStore: RegularityKPIStore
    graphDataStore: GraphDataStore

    constructor() {
        makeObservable(this);
        //Make sure these are called after makeObservable
        this.simulKPIStore = new SimulKPIStore(this);
        this.graphDataStore = new GraphDataStore(this);
        this.executionKPIStore = new ExecutionKPIStore(this);
        this.regularityKPIStore = new RegularityKPIStore(this);
    }

    @action
    setFileList(fileList: FileList | null) {
        this.fileList = fileList;
    }

    @action
    async updateParsedLog() {
        if (this.fileList === null) {
            this.parsedLog = [];
        } else {
            this.contentList.clear();
            for (let file of this.fileList) {
                const content = await file.text();
                this.contentList.push(content);
            }
            runInAction(() => {
                this.parsedLog = parseXesFromStrings(...this.contentList)
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

    @computed
    get mergedLog() {
        trace();
        if (this.isMergeLog)
            return mergeTrace(this.parsedLog, (trace1, trace2) =>
                trace1.events[0]["knr"]===trace2.events[0]["knr"]
            )
        else
            return this.parsedLog;
    }

    @action
    /**
     * Used for testing purpose
     * @param log
     */
    setParsedLog(log: EventLog) {
        this.parsedLog = log;
    }

    @action
    setMergeStrategy(value: boolean) {
        this.isMergeLog = value;
    }
}