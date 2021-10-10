import {parseXesFromStrings} from "../parser/XESParser";
import {readFile} from "./parser.spec";
import {createPairs, detectRegularities} from "../ContrainedExecution";
import {findMergeAttribute, mergeTrace} from "../MergeTrace";

it("regularity constraint test", () => {
    const bill = readFile("post", "billinstances.xes");
    const flyer = readFile("post", "flyerinstances.xes");
    const post = readFile("post", "posterinstances.xes");
    const mergedLog = parseXesFromStrings(bill, flyer, post);
    const mergeAttribute = findMergeAttribute(mergedLog)[0];
    mergeTrace(mergedLog, (trace1, trace2) =>
        trace1.events[0][mergeAttribute]===trace2.events[0][mergeAttribute]
    );
    const pairs=createPairs(mergedLog);
    const regularity0= detectRegularities(pairs[0], 0.95, 600_000)
    const regularity1= detectRegularities(pairs[1], 0.95, 600_000)
    const regularity2= detectRegularities(pairs[2], 0.95, 600_000)
    console.log("debug point");
});