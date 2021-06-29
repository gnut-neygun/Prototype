import cytoscape from "cytoscape";

export const layoutOptions = {
    name: 'dagre',
    nodeSep: 200,
    rankSep: 50,
}
export const graphStyle: cytoscape.Stylesheet[] = [
    {
        selector: '.hasLabel',
        css: {
            'label': (ele: { isNode: () => any; data: (arg0: string) => any; isEdge: () => any; }) => {
                if (ele.isNode()) return ele.data('id') ?? "";
                if (ele.isEdge()) return ele.data('label') ?? "";
            }
        }
    },
    {
        selector: 'node',
        style: {
            'label': 'data(id)'
        }
    },

    {
        selector: 'edge',
        style: {
            'width': 2,
            'line-color': '#436130',
            'target-arrow-color': '#436130',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'edge-distances': 'intersection',
            'target-endpoint': 'outside-to-line-or-label', //avoid intersecting with node label
        }
    },
    {
        selector: ':parent',
        style: {
            'shape': 'roundrectangle',
            "background-opacity": 0,
            "border-width": 1,
            "border-color": "black"
        },
    }
]
