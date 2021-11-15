import {parseXesFromStrings} from "../parser/XESParser";
import {readFile} from "./parser.spec";
import {createPairs, detectRegularities} from "../ContrainedExecution";
import {findMergeAttribute, mergeTrace} from "../MergeTrace";

it("regularity constraint performance test", () => {
    const bill = readFile("post", "billinstances.xes");
    const flyer = readFile("post", "flyerinstances.xes");
    const post = readFile("post", "posterinstances.xes");
    const parsedLog = parseXesFromStrings(bill, flyer, post);
    const mergeAttribute = findMergeAttribute(parsedLog)[0];
    const mergedLog = mergeTrace(parsedLog, (trace1, trace2) =>
        trace1.events[0][mergeAttribute] === trace2.events[0][mergeAttribute]
    );
    let timeStart = performance.now()
    const pairs = createPairs(mergedLog);
    let timeDuration = performance.now() - timeStart;
    console.log("Create pair duration: " + timeDuration)
    timeStart = performance.now()
    const regularity0 = detectRegularities(pairs[0], 0.95, 600_000)
    timeDuration = performance.now() - timeStart;
    console.log("Regularity begin_end: " + timeDuration)
    timeStart = performance.now()
    const regularity1 = detectRegularities(pairs[1], 0.95, 600_000)
    timeDuration = performance.now() - timeStart;
    console.log("Regularity start-start " + timeDuration)
    timeDuration = performance.now() - timeStart;
    const regularity2 = detectRegularities(pairs[2], 0.95, 600_000)
    timeDuration = performance.now() - timeStart;
    console.log("Regularity start-complete " + timeDuration);
});