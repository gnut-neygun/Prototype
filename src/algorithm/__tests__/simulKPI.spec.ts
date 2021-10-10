import {parseXESFromString, parseXesFromStrings} from "../parser/XESParser";
import {discoverSimultaneousIsc, fastDiscoverSimultaneousIsc} from "../SimulConstraint";
import {readFile} from "./parser.spec";
import {FileStore} from "../../shared/store/FileStore";


const bill = readFile("post", "billinstances.xes");
const flyer = readFile("post", "flyerinstances.xes");
const post = readFile("post", "posterinstances.xes");
const mergedLog = parseXesFromStrings(bill, flyer, post);
const fileStore = new FileStore();
const kpiStore = fileStore.simulKPIStore;
fileStore.setMergedLog(mergedLog);

it('fast discover ISC', () => {
    const isc = fastDiscoverSimultaneousIsc(mergedLog);
    console.log("debug point)");
});

it("simultaneous ISC", () => {
    const content = readFile("post", "billinstances.xes")
    const log = parseXESFromString(content);
    console.log(discoverSimultaneousIsc(log));
});

it("kpi store test get activities name", () => {
    const names=kpiStore.activitiesName
    console.log(names);
    expect(names.length).toBe(3)
});

it("kpi store test absolute occurence", () => {
    console.log(kpiStore.absoluteOccurenceMap)
});