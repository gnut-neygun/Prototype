import {EventLog, XesEvent} from "./parser/XESModels";

/**
 *
 * @param event1
 * @param event2
 * @returns number time difference in milisecs
 */
function timeDifferences(event1: XesEvent, event2: XesEvent): number {
    return Math.abs(event1.time().valueOf() - event2.time().valueOf());
}

export function discoverSimultaneousIsc(mergedLog: EventLog, timeDeltaInSeconds: number = 0.1, relativeEventOccurence: number = 0.95, lifecycle: string[] = ["start"]) {
    const events: XesEvent[] = []
    const absEventOccurences: { [key: string]: number } = {}
    for (let trace of mergedLog) {
        for (let event of trace.events) {
            if (lifecycle.includes(event.lifecycle())) {
                events.push(event)
                if (absEventOccurences[event.name()] === undefined) {
                    absEventOccurences[event.name()] = 0;
                } else {
                    absEventOccurences[event.name()] += 1;
                }
            }
        }
    }
    events.sort((event1, event2) => event1.time().valueOf() - event2.time().valueOf())

    function filterEventLabels(): string[] {
        const ret: string[] = [];
        const simultaneousEventOccurences = {...absEventOccurences};
        let found: boolean = false;
        for (let [count, event] of events.entries()) {
            if (count < events.length - 1) {
                for (let j = count + 1; j < events.length; j++) {
                    if (timeDifferences(events[j], event) <= timeDeltaInSeconds * 1000) {
                        if (events[j].trace !== event.trace) {
                            found = true;
                            break;
                        }
                    } else {
                        if (found) {
                            found = false;
                        } else {
                            simultaneousEventOccurences[event.name()] -= 1;
                        }
                        break;
                    }
                }
            }
        }
        for (let key of Object.keys(absEventOccurences)) {
            const absolut_value = absEventOccurences[key];
            const current_value = simultaneousEventOccurences[key];
            if (current_value / absolut_value >= relativeEventOccurence) {
                ret.push(key);
            }
        }
        return ret
    }

    const filteredEventLabels = filterEventLabels()
    const simActivities: Map<string, Array<XesEvent[]>> = new Map()
    for (const [i, event] of events.entries()) {
        if (!filteredEventLabels.includes(event.name()))
            continue
        const cluster = [event]
        for (let j = i + 1; j < events.length; j++) {
            if (!filteredEventLabels.includes(events[j].name()))
                continue
            if (timeDifferences(events[j], event) <= timeDeltaInSeconds * 1000) {
                if (events[j].trace !== event.trace) {
                    cluster.push(events[j]);
                }
            } else {
                break;
            }
        }
        if (cluster.length > 1) {
            const eventNameClusterSet = new Set(cluster.map(event => event.name()));
            const key = [...eventNameClusterSet].sort().join(";")
            if (simActivities.get(key) === undefined)
                simActivities.set(key, []);
            else {
                simActivities.get(key)?.push(cluster);
            }
        }
    }

    return simActivities
}

export function fastDiscoverSimultaneousIsc(mergedLog: EventLog, timeDeltaInSeconds: number = 10, relativeEventOccurence: number = 0.6, lifecycle: string[] = ["start"]) {
    const events: XesEvent[] = []
    const absEventOccurences: { [key: string]: number } = {}
    for (let trace of mergedLog) {
        for (let event of trace.events) {
            if (lifecycle.includes(event.lifecycle())) {
                events.push(event)
                if (absEventOccurences[event.name()] === undefined) {
                    absEventOccurences[event.name()] = 0;
                } else {
                    absEventOccurences[event.name()] += 1;
                }
            }
        }
    }
    events.sort((event1, event2) => event1.time().valueOf() - event2.time().valueOf())

    function filterEventLabels(): string[] {
        const ret: string[] = [];
        const simultaneousEventOccurences = {...absEventOccurences};
        let found: boolean = false;
        for (let [count, event] of events.entries()) {
            if (count < events.length - 1) {
                for (let j = count + 1; j < events.length; j++) {
                    if (timeDifferences(events[j], event) <= timeDeltaInSeconds * 1000) {
                        if (events[j].trace !== event.trace) {
                            found = true;
                            break;
                        }
                    } else {
                        if (found) {
                            found = false;
                        } else {
                            simultaneousEventOccurences[event.name()] -= 1;
                        }
                        break;
                    }
                }
            }
        }
        for (let key of Object.keys(absEventOccurences)) {
            const absolut_value = absEventOccurences[key];
            const current_value = simultaneousEventOccurences[key];
            if (current_value / absolut_value >= relativeEventOccurence) {
                ret.push(key);
            }
        }
        return ret
    }

    const filteredEventLabels = filterEventLabels();
    const simActivities: Map<string, Array<XesEvent[]>> = new Map()
    for (let start=0, end = 1;end < events.length;) {
        if (filteredEventLabels.includes(events[start].name())) {
            const cluster= events.slice(start, end)
            let hasChanged = false;
            for (; end < events.length; end++) {
                if (timeDifferences(events[start], events[end]) <= timeDeltaInSeconds * 1000) {
                    if (events[start].trace !== events[end].trace)
                        cluster.push(events[end]);
                    hasChanged = true;
                } else {
                    break;
                }
            }
            if (cluster.length > 1 && hasChanged) {
                const eventNameClusterSet = new Set(cluster.map(event => event.name()));
                const key = [...eventNameClusterSet].sort().join(";")
                if (simActivities.get(key) === undefined)
                    simActivities.set(key, []);
                else {
                    simActivities.get(key)?.push(cluster);
                }
            }
        }
        start++;
        if (start===end)
            end++;
    }
    return simActivities
}