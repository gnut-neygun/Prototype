declare global {
    interface Array<T> {
        pushSorted<T>(el: T, compareFn: (arg0: T, arg1: T) => number): void
    }

    interface Map<K, V> {
        /**
         * Set a value on a key of a the map. If the key is not present, set to an array and push it. If the array at the specified key is present, push the value into the array.
         */
        pushIntoKey(key: K, value: V extends Array<infer T> ? T : never): void
    }
}
// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype,"pushSorted", {value:  function<T>(el: T, compareFn: (arg0: T, arg1: T) => number) {
    this.splice((function(arr) {
        let m = 0;
        let n = arr.length - 1;

        while(m <= n) {
            const k = (n + m) >> 1;
            const cmp = compareFn(el, arr[k]);

            if(cmp > 0) m = k + 1;
            else if(cmp < 0) n = k - 1;
            else return k;
        }

        return -m - 1;
    })(this), 0, el);

    return this.length;
}});

// eslint-disable-next-line no-extend-native
Object.defineProperty(Map.prototype, "pushIntoKey", {
    value: function<K,V>(key: K, value: V): void {
        const self = this as Map<K,V[]>
        if (!self.get(key))
            self.set(key, [])
        this.get(key).push(value);
    }})
export {}