import {EventLog, Trace, XesEvent} from "./XESModels";

export function parseXESFromString(xesContent: string): EventLog {
    const parser = new DOMParser()
    const document: XMLDocument = parser.parseFromString(xesContent, "text/xml");
    const eventLog: EventLog = [];
    const log = document.getElementsByTagName("log").item(0);
    if (log === null) {
        throw new Error("parse error");
    }
    let traceId = 0;
    for (const trace of log.getElementsByTagName("trace")) {
        const myTrace = new Trace(traceId);
        traceId++;
        const traceChildren = trace.children;
        for (const child of traceChildren) {
            if (child.localName === "string") {
                myTrace.attributes[child.getAttribute("key")!!] = child.getAttribute("value")!!;
            } else {
                break;
            }
        }
        for (const xesEvent of trace.getElementsByTagName("event")) {
            const myXesEvent = new XesEvent(myTrace);
            for (const eventNode of xesEvent.children) {
                if (eventNode.localName === "int") {
                    const value = eventNode.getAttribute("value");
                    if (value === null)
                        throw new Error("No value for attribute of event")
                    myXesEvent[eventNode.getAttribute("key")!!] = parseInt(value);
                } else if (eventNode.localName === "date") {
                    myXesEvent[eventNode.getAttribute("key")!!] = Date.parse(eventNode.getAttribute("value")!!).valueOf();
                } else {
                    myXesEvent[eventNode.getAttribute("key")!!] = eventNode.getAttribute("value")!!;
                }
            }
            myTrace.append(myXesEvent);
        }
        eventLog.push(myTrace);
    }
    return eventLog;
}

export function parseXesFromStrings(...xesContents: string[]): EventLog {
    return xesContents.flatMap(content => parseXESFromString(content));
}