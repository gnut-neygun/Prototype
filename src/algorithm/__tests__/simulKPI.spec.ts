import {parseXesFromStrings} from "../parser/XESParser";
import {discoverSimultaneousIsc, fastDiscoverSimultaneousIsc} from "../SimulConstraint";
import {readFile} from "./parser.spec";


const bill = readFile("post", "billinstances.xes");
const flyer = readFile("post", "flyerinstances.xes");
const post = readFile("post", "posterinstances.xes");
const mergedLog = parseXesFromStrings(bill, flyer, post);

it('fast discover ISC performance measurement', () => {
    const start = performance.now();
    const isc = fastDiscoverSimultaneousIsc(mergedLog);
    const end = performance.now()
    console.log(end - start);
});

it('normal ISC performance measurement', () => {
    const start = performance.now();
    const isc = discoverSimultaneousIsc(mergedLog);
    const end = performance.now()
    console.log(end - start);
});
