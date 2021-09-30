import {action, makeObservable, observable} from "mobx";
import {EventLog} from "../../algorithm/parser/XESModels";
import {parseXesFromStrings} from "../../algorithm/parser/XESParser";

class FileStore {

    @observable
    fileList: FileList | null = null
    @observable
    public mergedLog: EventLog = []
    @observable
    lifecycleOption: string[] = ["start"]

    constructor() {
        makeObservable(this);
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
            this.mergedLog=parseXesFromStrings(...contentList)
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

export const fileStore = new FileStore();