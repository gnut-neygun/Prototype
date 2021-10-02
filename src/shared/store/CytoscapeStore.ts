import {Core} from "cytoscape";
import {autorun} from "mobx";

export class CytoscapeStore {
    ref: Core | null = null;
    constructor() {
        autorun(() => {

        });
    }

}

export const cytoscapeStore = new CytoscapeStore();