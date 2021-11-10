import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {EventLog, XesEvent} from "../../algorithm/parser/XESModels";
import {parseXesFromStrings} from "../../algorithm/parser/XESParser";
import {SimulKPIStore} from "./SimulKPIStore";
import {GraphDataStore} from "./GraphDataStore";
import {GraphType, requestHeuristicMiner} from "../server_api/api";
import {GraphGenerationInput} from "../GraphGenerators";
import {ExecutionKPIStore} from "./ExecutionKPIStore";
import {findMergeAttribute, mergeTrace} from "../../algorithm/MergeTrace";
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
    mergeAttribute: string | undefined

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

    @computed
    get mergeAttributes(): string[] {
        if (this.parsedLog.length === 0)
            return [];
        return findMergeAttribute(this.parsedLog).also(it => console.log(it))
    }

    @action
    async updateParsedLog() {
        if (this.fileList === null) {
            this.parsedLog = [];
            return;
        } else {
            this.graphDataStore.setIsLoading(true);
            const contentStrings: string[] = [];
            const _contentList: GraphGenerationInput[] = []; //use this to batch mutation
            this.contentList.length=0;
            try {
                for (let file of this.fileList) {
                    const content = await file.text();
                    const response = await requestHeuristicMiner(GraphType.heuristic_net, content);
                    console.log(response.data);
                    _contentList.push({
                        name: file.name,
                        content: response.data.content,
                        startActivities: response.data.startActivities,
                        endActivities: response.data.endActivities,
                        activities: response.data.activities,
                    });
                    contentStrings.push(content);
                }
            } catch (e){
                console.log(e);
                this.graphDataStore.setIsLoading(false);
                //Run parsed log anyway
                for (let file of this.fileList) {
                    const content = await file.text();
                    contentStrings.push(content);
                }
            } finally {
                runInAction(() => {
                    //Setting these both will trigger some initialization in other KPI stores
                    this.parsedLog = parseXesFromStrings(...contentStrings)
                    this.contentList = _contentList;
                });
            }
        }
    }

    @computed({keepAlive: true})
    get mergedLog() {
        if (this.isMergeLog && this.mergeAttribute !== undefined)
            return mergeTrace(this.parsedLog, (trace1, trace2) => {
                const attr = this.mergeAttribute!!
                return trace1.events[0][attr] === trace2.events[0][attr];
            })
        else
            return this.parsedLog;
    }

    @computed({keepAlive: true})
    get resourceList(): string[] {
        const resourceArray = this.sortedEventList.filter(e => e.resource() !== undefined).map(e => e.resource()!!)
        return [...new Set(resourceArray)]
    }

    @computed
    get sortedEventList(): XesEvent[] {
        const events: XesEvent[] = []
        for (let trace of this.mergedLog) {
            for (let event of trace.events) {
                if (this.lifecycleOption.includes(event.lifecycle() ?? "undefined")) {
                    events.push(event)
                }
            }
        }
        events.sort((event1, event2) => event1.time().valueOf() - event2.time().valueOf())
        return events;
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