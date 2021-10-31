import {EventLog, Trace} from "./parser/XESModels";
import _ from "lodash";

export function findMergeAttribute(log: EventLog): string[] {
    return ["knr"]
}

export function mergeTrace(oldLog: EventLog, mergeCriteria: (trace1 : Trace, trace2: Trace) => boolean) {
    const log= _.cloneDeep(oldLog)
    for (let i = 0; i < log.length; i++) {
        const trace = log[i];
        for (let n = i + 1; n < log.length; n++) {
            const mergingTrace = log[n];
            if (mergeCriteria(trace, mergingTrace)) {
                for (let event of mergingTrace.events) {
                    event.trace = trace;
                    trace.append(event);
                }
                log.splice(n, 1);
                n-- //So that we don't skip index
            }
        }
        trace.events.sort((event1, event2) => event1.time().valueOf()-event2.time().valueOf())
    }
    return log;
}