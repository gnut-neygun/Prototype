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
}

export type EventLog = Trace[]