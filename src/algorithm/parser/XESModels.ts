// noinspection JSUnusedGlobalSymbols

export class XesEvent {
    [attribute: string]: any

    constructor(public trace: Trace) {
    }

    instance(): string | undefined {
        return this["concept:instance"]
    }

    name(): string {
        return this["concept:name"]
    }

    lifecycle(): string {
        return this["lifecycle:transition"] ?? "undefined"
    }

    time(): number {
        return this["time:timestamp"]
    }

    timeString(): string {
        return new Date(this["time:timestamp"]).toISOString()
    }

    resource(): string | undefined {
        return this["org:resource"]
    }

    /**
     * Used to generate unique key for XES table, should be unique for each event
     */
    toString(): string {
        return `{${this.instance()},${this.name()},${this.time()},${this.lifecycle()},${this.resource()??""}}`
    }
}

export class Trace {

    /**
     *
     * @param attributes
     * @param events
     * @param uniqueId used to uniquely identify a trace on distribution graph. Generated internally
     */
    constructor(public uniqueId: number, public attributes: { [key in string]: string } = {}, public events: XesEvent[] = []) {
    }

    public append(event: XesEvent) {
        this.events.push(event)
    }

    public appendSorted(event: XesEvent) {
        this.events.pushSorted(event, (event1, event2) => event1.time().valueOf() - event2.time().valueOf())
    }

    public name() {
        return this.attributes["concept:name"]
    }

    public cloneWithFilter(filter?: (x: XesEvent) => boolean): Trace {
        const cloned = [...this.events]
        if (filter === undefined)
            return new Trace(this.uniqueId, this.attributes, cloned);
        else
            return new Trace(this.uniqueId, this.attributes, cloned.filter(filter))
    }
}

export type EventLog = Trace[]