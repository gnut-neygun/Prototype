// noinspection JSUnusedGlobalSymbols

export class XesEvent {
    [attribute: string]: any

    readonly #trace: Trace;

    constructor(trace: Trace) {
        this.#trace = trace;
    }

    get trace(): Trace {
        return this.#trace;
    }

    name(): string {
        return this["concept:name"]
    }

    lifecycle(): string {
        return this["lifecycle:transition"]
    }

    time(): Date {
        return this["time:timestamp"]
    }

    toString(): string {
        return `{${this.name()}, ${this.time()}}`
    }
}

export class Trace {
    constructor(public attributes: { [key in string]: string } = {}, public events: XesEvent[] = []) {
    }

    public append(event: XesEvent) {
        this.events.push(event)
    }

    public appendSorted(event: XesEvent) {
        this.events.pushSorted(event, (event1, event2) => event1.time().valueOf()-event2.time().valueOf())
    }

    public cloneWithFilter(filter?: (x: XesEvent) => boolean ): Trace {
        const cloned=[...this.events]
        if (filter===undefined)
            return new Trace(this.attributes, cloned);
        else
            return new Trace(this.attributes, cloned.filter(filter))
    }
}

export type EventLog = Trace[]