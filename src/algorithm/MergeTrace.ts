import {EventLog, Trace} from "./parser/XESModels";
import {deepClone} from "../utilities/utilities";

export function findMergeAttribute(...logs: EventLog[]): string[] {
    //Implementation detail, we already use trace for each XESEvent to reference the parent trace, so filter that out.
    const candidateAttributes: string[] = Object.keys(logs[0][0].events[0]).filter(attr => attr !== "trace")
    //Iterate through the traces and successively filter out the candidate attributes, this is O(n)
    for (let log of logs) {
        for (let trace of log) {
            const traceCandidateValues: Record<string, any> = {};
            const events = trace.events;
            for (let event of events) {
                //check if all candidate attributes are also in event attributes
                for (let attr of candidateAttributes) {
                    if (event[attr] === undefined) {
                        candidateAttributes.popValue(attr);
                        delete traceCandidateValues[attr];
                    } else {
                        if (traceCandidateValues[attr] === undefined)
                            traceCandidateValues[attr] = event[attr]
                        else if (traceCandidateValues[attr] !== event[attr]) {
                            candidateAttributes.popValue(attr);
                            delete traceCandidateValues[attr];
                        }
                    }
                }
            }
        }
    }
    return candidateAttributes;
}

export function mergeTrace(oldLog: EventLog, mergeCriteria: (trace1 : Trace, trace2: Trace) => boolean) {
    const log: EventLog = deepClone(oldLog)
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