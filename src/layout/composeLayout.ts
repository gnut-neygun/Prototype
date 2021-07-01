import {cytoscapeRef} from "../app/globalVariables";
import {Core} from "cytoscape";
import {store} from "../app/store";
import {graphDataSelector} from "../app/graphDataSlice";

/*
type NodeBoundingBox = {
    id: string,
    boundingBox: BoundingBox12 & BoundingBoxWH
}
*/

export default function composeLayout() {
    const cy = cytoscapeRef.cy as Core
    cy.layout(graphDataSelector(store.getState()).layout).run()
};

/*export default function composeLayout() {
    const cy = cytoscapeRef.cy as Core //Get cy ref from global object, when this function this variable is expected to be initialized
    cy.layout({name: "cose-bilkent"}).run();
};*/
