import {EventLog, XesEvent} from "./parser/XESModels";
import "../utilities/extensionFunctions"

type EventPair = [XesEvent, XesEvent, number]
type PairDict = Map<string, EventPair[]>

export function createPairs(mergedLog: EventLog) {
    const begin_end: PairDict = new Map<string, EventPair[]>()
    const start_start: PairDict = new Map<string, EventPair[]>()
    const start_complete: PairDict = new Map<string, EventPair[]>()
    for (let trace of mergedLog) {
        begin_end.pushIntoKey(trace.events[0].name() + "," + trace.events[trace.events.length - 1].name(), [trace.events[0], trace.events[trace.events.length - 1], Math.abs(
            trace.events[0].time().valueOf() - trace.events[trace.events.length - 1].time().valueOf()) / 1000] as EventPair)
        for (let i = 0; i < trace.events.length; i++) {
            const startEvent = trace.events[i];
            if (startEvent.lifecycle() !== "start")
                continue;
            for (let j = i + 1; j < trace.events.length; j++) {
                const followEvent = trace.events[j];
                if (startEvent.name() === followEvent.name() && followEvent.lifecycle() === "complete") {
                    start_complete.pushIntoKey(startEvent.name(), [startEvent, followEvent, Math.abs(startEvent.time().valueOf() - followEvent.time().valueOf() / 1000)]);
                    break;
                }
            }
            for (let j = i + 1; j < trace.events.length; j++) {
                const followEvent = trace.events[j];
                if (followEvent.lifecycle() === "start") {
                    start_start.pushIntoKey(startEvent.name(), [startEvent, followEvent, Math.abs(startEvent.time().valueOf() - followEvent.time().valueOf() / 1000)]);
                    break;
                }
            }
        }
    }
    return [begin_end, start_start, start_complete]
}

export function detectRegularities(pairs: PairDict, relativeOccurenceThresold?: number, timeFrameInMilis?: number) {
    if (relativeOccurenceThresold===undefined && timeFrameInMilis===undefined)
        throw Error("Parameters to detectRegularities can not both be undefined")
    else if (relativeOccurenceThresold === undefined) {

    } else if (timeFrameInMilis === undefined) {
        const deltas= {}
        for (let [key, val] of pairs.entries()) {
            
        }
    } else {
        //both parameters are defined
    }
}