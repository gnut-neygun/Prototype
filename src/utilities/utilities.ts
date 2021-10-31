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