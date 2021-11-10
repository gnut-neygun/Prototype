import {EventLog, XesEvent} from "./parser/XESModels";
import "../utilities/extensionFunctions"
import {getMean, getStandardDeviation} from "../utilities/utilities";

export type EventPair = [XesEvent, XesEvent, number]
export type PairDict = Map<string, EventPair[]>

/**
 * begin_end: For each trace, find the begin and end event event in the merged log.
 * start_start: Directly follow event
 * start_complete: Start and complete lifecycle
 * @param mergedLog
 */
export function createPairs(mergedLog: EventLog) {
    const begin_end: PairDict = new Map<string, EventPair[]>()
    const start_start: PairDict = new Map<string, EventPair[]>()
    const start_complete: PairDict = new Map<string, EventPair[]>()
    for (let trace of mergedLog) {
        begin_end.pushIntoKey(trace.events[0].name() + "," + trace.events[trace.events.length - 1].name(), [trace.events[0], trace.events[trace.events.length - 1], Math.abs(
            trace.events[0].time().valueOf() - trace.events[trace.events.length - 1].time().valueOf())] as EventPair)
        for (let i = 0; i < trace.events.length; i++) {
            const startEvent = trace.events[i];
            if (startEvent.lifecycle() !== "start")
                continue;
            for (let j = i + 1; j < trace.events.length; j++) {
                const followEvent = trace.events[j];
                if (startEvent.name() === followEvent.name() && followEvent.lifecycle() === "complete") {
                    start_complete.pushIntoKey(startEvent.name()+","+followEvent.name(), [startEvent, followEvent, Math.abs(startEvent.time().valueOf() - followEvent.time().valueOf())]);
                    break;
                }
            }
            for (let j = i + 1; j < trace.events.length; j++) {
                const followEvent = trace.events[j];
                if (followEvent.lifecycle() === "start") {
                    start_start.pushIntoKey(startEvent.name()+","+followEvent.name(), [startEvent, followEvent, Math.abs(startEvent.time().valueOf() - followEvent.time().valueOf())]);
                    break;
                }
            }
        }
    }
    return [begin_end, start_start, start_complete]
}

export function detectRegularities<Occurence extends number | undefined, Time extends number | undefined>(pairs: PairDict, relativeOccurenceThresold?: Occurence, timeFrameInMilis?: Time): Occurence | Time extends undefined? Record<string, number> : Record<string, boolean>{
    if (relativeOccurenceThresold===undefined && timeFrameInMilis===undefined)
        throw Error("Parameters to detectRegularities can not both be undefined")
    else if (relativeOccurenceThresold === undefined) {
        const result : Record<string, number> = {}
        for (let [key, val] of pairs.entries()) {
            const count = val.filter(pair => pair[2] <= (timeFrameInMilis as number)).length;
            result[key] = count / val.length;
        }
        return result as any;
    } else if (timeFrameInMilis === undefined) {
        const result: Record<string, number> = {}
        for (let [key, val] of pairs.entries()) {
            const n = Math.floor(val.length - (relativeOccurenceThresold as number) * val.length)
            //reverse sort
            val.sort((eventPair1, eventPair2) => eventPair2[2]-eventPair1[2]);
            result[key] = val[n][2];
        }
        return result as any; //Typescript won't try to reason about return conditional type, but we get typesafety at the use site.
    } else {
        const result : Record<string, boolean> = {}
        for (let [key, val] of pairs.entries()) {
            const count = val.filter(pair => pair[2] <= (timeFrameInMilis as number)).length;
            const discoveredOccurence = count / val.length;
            if (discoveredOccurence >= relativeOccurenceThresold)
                result[key] = true;
            else
                result[key] = false;
        }
        return result as any;
    }
}

export function detectExecutionConstraint(eventList: XesEvent[], relativeOccurence: number, groupFunction: (event: XesEvent) => string) {
    const result: Map<string, XesEvent[]> = new Map();
    eventList.forEach((event: XesEvent) => {
        result.pushIntoKey(groupFunction(event), event);
    });
    return result;
}

export function detectOutliers(pairs: PairDict) {
    const outliers = [];
    for (const eventPairs of pairs.values()) {
        const deltas = eventPairs.map(pair => pair[2]);
        if (deltas.length < 2)
            continue;
        const mean = getMean(deltas);
        const stdDeviation = getStandardDeviation(deltas);
        const z_sc = [];
        for (const delta of deltas) {
            if (stdDeviation !== 0) {
                z_sc.push((delta - mean) / stdDeviation);
            } else {
                z_sc.push(NaN);
            }
        }
        for (let i = 0; i < deltas.length; i++) {
            if (Math.abs(z_sc[i]) > 3)
                outliers.push(eventPairs[i])
        }
    }
    return outliers;
}