import {action, computed, makeObservable, observable, runInAction, trace} from "mobx";
import {EventLog} from "../../algorithm/parser/XESModels";
import {parseXesFromStrings} from "../../algorithm/parser/XESParser";
import {SimulKPIStore} from "./SimulKPIStore";
import {GraphDataStore} from "./GraphDataStore";
import {GraphType, requestHeuristicMiner} from "../server_api/api";
import {GraphGenerationInput} from "../GraphVizDataParser";
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
    contentList: GraphGenerationInput[] = []
    @observable
    isMergeLog: boolean = false;
    @observable
    isLoading: boolean = false;

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
        const contentStrings: string[] = [];
        const _contentList: GraphGenerationInput[] = []; //use this to batch mutation
        if (this.fileList === null) {
            this.parsedLog = [];
        } else {
            this.contentList.length=0;
            for (let file of this.fileList) {
                const content = await file.text();
                const response = await requestHeuristicMiner(GraphType.heuristic_net, content);
                _contentList.push({
                    name: file.name,
                    content: response.data.content
                });
                contentStrings.push(content);
            }
            runInAction(() => {
                this.parsedLog = parseXesFromStrings(...contentStrings)
                this.contentList = _contentList;
            });
        }
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