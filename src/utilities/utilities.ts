/**
 * From stack overflow
 * @param data
 * @param keyFunction
 */
export function groupBy<Item extends Record<string, any>>(data: Item[], keyFunction: (e: Item) => string): Record<string, Item[]> {
    // reduce runs this anonymous function on each element of `data` (the `item` parameter,
    // returning the `storage` parameter at the end
    return data.reduce(function (storage: Record<string, Item[]>, item) {
        // get the first instance of the key by which we're grouping
        const group = keyFunction(item);

        // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
        storage[group] = storage[group] || [];

        // add this item to its group within `storage`
        storage[group].push(item);

        // return the updated storage to the reduce function, which will then loop through the next
        return storage;
    }, {}); // {} is the initial value of the storage
}

/**
 * From Stackoverflow
 * @param timeDeltaInMillis
 */
export function formatTimeDuration(timeDeltaInMillis: number): string {
    const timeDelta = timeDeltaInMillis / 1000;
    let hours = Math.floor(timeDelta / 3600);
    let minutes = Math.floor((timeDelta - (hours * 3600)) / 60);
    let seconds = timeDelta - (hours * 3600) - (minutes * 60);

    if (hours < 10) { // @ts-ignore
        hours = "0" + hours.toString();
    }
    if (minutes < 10) { // @ts-ignore
        minutes = "0" + minutes.toString();
    }
    if (seconds < 10) { // @ts-ignore
        seconds = "0" + seconds.toFixed(0);
    } else {
        // @ts-ignore
        seconds = seconds.toFixed(0)
    }
    return hours + 'h:' + minutes + 'm:' + seconds + "s";
}

/**
 * https://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript
 * @param obj
 * @param hash
 */
export function deepClone(obj: any, hash = new WeakMap()): any {
    if (Object(obj) !== obj) return obj; // primitives
    if (hash.has(obj)) return hash.get(obj); // cyclic reference
    const result: any = obj instanceof Set ? new Set(obj) // See note about this!
        : obj instanceof Map ? new Map(Array.from(obj, ([key, val]) =>
                [key, deepClone(val, hash)]))
            : obj instanceof Date ? new Date(obj)
                : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
                    // ... add here any specific treatment for other classes ...
                    // and finally a catch-all:
                    : obj.constructor ? new obj.constructor()
                        : Object.create(null);
    hash.set(obj, result);
    return Object.assign(result, ...Object.keys(obj).map(
        key => ({[key]: deepClone(obj[key], hash)})));
}


export function getMean(array: number[]) {
    const sum = array.reduce((sum, value) => sum + value, 0);
    return sum / array.length;
}

/**
 * https://stackoverflow.com/questions/7343890/standard-deviation-javascript
 * @param array
 */
export function getStandardDeviation(array: number[]) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}