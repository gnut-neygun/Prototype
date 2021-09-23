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
        let hit: boolean = false;
        for (let [count, event] of events.entries()) {
            if (count < events.length - 1) {
                for (let j = count + 1; j < events.length; j++) {
                    if (timeDifferences(events[j], event) <= timeDeltaInSeconds * 1000) {
                        if (events[j].trace !== event.trace) {
                            hit = true;
                            break;
                        }
                    } else {
                        if (hit) {
                            hit = false;
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
    const simActivities: { [key: string]: Array<XesEvent[]> } = {}
    for (const [i, event] of events.entries()) {
        if (!filteredEventLabels.includes(event.name()))
            continue
        const x = [event]
        for (let j = i + 1; j < events.length; j++) {
            if (!filteredEventLabels.includes(events[j].name()))
                continue
            if (timeDifferences(events[j], event) <= timeDeltaInSeconds * 1000) {
                if (events[j].trace !== event.trace) {
                    x.push(events[j]);
                }
            } else {
                break;
            }
        }
        if (x.length > 1) {
            const foo = new Set(x.map(event => event.name()));
            const key = [...foo].join(";")
            if (simActivities[key] === undefined)
                simActivities[key] = []
            simActivities[key].push(x);
        }
    }

    return simActivities
}