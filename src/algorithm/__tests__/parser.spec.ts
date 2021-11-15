import {parseXESFromString, parseXesFromStrings} from "../parser/XESParser";
import {discoverSimultaneousIsc} from "../SimulConstraint";
import * as fs from 'fs'
import * as path from "path";
import {createPairs} from "../ContrainedExecution";
import {findMergeAttribute} from "../MergeTrace";

export function readFile(type: string = "post", name: string): string {

    return fs.readFileSync(path.resolve(__dirname, "data", type, name), "utf8")
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

it('create pairs', () => {
    const content = readFile("post", "billinstances.xes");
    const xesModel = parseXESFromString(content);
    const pairs = createPairs(xesModel)
    console.log("debug point");
});

it('discover attribute trace merge single file', () => {
    const bill = readFile("post", "billinstances.xes");
    const xesModel = parseXESFromString(bill);
    const attributes = findMergeAttribute(xesModel).sort()
    console.log(attributes);
    expect(attributes).toEqual(['concept:instance', 'knr']);
});

it('discover attribute trace merge multiple files', () => {
    const bill = readFile("post", "billinstances.xes");
    const flyer = readFile("post", "flyerinstances.xes");
    const post = readFile("post", "posterinstances.xes");
    const billModel = parseXESFromString(bill);
    const flyerModel = parseXesFromStrings(flyer);
    const postModel = parseXesFromStrings(post);
    const attributes = findMergeAttribute(billModel, flyerModel, postModel).sort()
    expect(attributes).toEqual(['knr', 'concept:instance'].sort());
});

it('discover attribute trace merge multiple files one argument', () => {
    const bill = readFile("post", "billinstances.xes");
    const flyer = readFile("post", "flyerinstances.xes");
    const post = readFile("post", "posterinstances.xes");
    const xesModel = parseXesFromStrings(post, flyer, post);
    const attributes = findMergeAttribute(xesModel).sort()
    expect(attributes).toEqual(['knr', 'concept:instance'].sort);
});