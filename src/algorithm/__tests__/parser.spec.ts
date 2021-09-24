import {parseXESFromString, parseXesFromStrings} from "../parser/XESParser";
import {discoverSimultaneousIsc, fastDiscoverSimultaneousIsc} from "../simultaneousIsc";
import fs from "fs";
import path from "path";

function readFile(type: string = "post", name: string): string {
    const options = {
        encoding: "utf8",

    }
    return fs.readFileSync(path.resolve(__dirname, "data", type, name), options);
}

it('parser', () => {
    const content = readFile("post", "billinstances.xes");
    const xesModel = parseXESFromString(content);
    console.log("debug point");
});

it('parser with multiple files', () => {
    const bill = readFile("post", "billinstances.xes");
    const flyer = readFile("post", "flyerinstances.xes");
    const post = readFile("post", "posterinstances.xes");
    const mergedLog = parseXesFromStrings(bill, flyer, post);
    const isc = discoverSimultaneousIsc(mergedLog);
    console.log("debug point)");
});

it("datetime parser", () => {
    const value = "2017-03-01T09:55:19.523+01:00";
    const value2 = "2017-03-01T09:59:19.523+01:00";
    const date = Date.parse(value);
    const date2 = Date.parse(value2);
    console.log(date < date2);
    console.log(date2 - date);
    console.log(date - date2);
});

it("simultaneous ISC", () => {
    const content = readFile("post", "billinstances.xes")
    const log = parseXESFromString(content);
    console.log(discoverSimultaneousIsc(log));
});

it('fast discover ISC', () => {
    const bill = readFile("post", "billinstances.xes");
    const flyer = readFile("post", "flyerinstances.xes");
    const post = readFile("post", "posterinstances.xes");
    const mergedLog = parseXesFromStrings(bill, flyer, post);
    const isc = fastDiscoverSimultaneousIsc(mergedLog);
    console.log("debug point)");
});