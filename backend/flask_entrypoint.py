import json
from typing import List

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, fields, marshal_with
from pm4py.objects.log.importer.xes import importer as xes_importer

from detect_data_constraint import detectOutliers, detectDataLimitation
from enums import GraphType
from process_mining import inductive_miner_with_heuristic_net

app = Flask(__name__)
CORS(app)  # Enable CORS for all route

api = Api(app)

response_format = {
    'activities': fields.List(fields.String),
    'startActivities': fields.List(fields.String),
    'endActivities': fields.List(fields.String),
    'content': fields.String,
}


# Example request
# {
#     "graph_type": "heuristic_net",
#     "data": ["contentlog1", "contentlog2"]  # Should be data in a xes file
# }
@marshal_with(response_format)
@app.route('/heuristic_miner', methods=['POST'])
def heuristicMinerEndPoint():
    content: str = ""
    activities: List[str] = []
    startActivities: List[str] = []
    endActivities: List[str] = []
    json_object = request.get_json(force=True)
    graphType = GraphType[json_object["graph_type"]]
    log = xes_importer.deserialize(json_object["data"])
    heuNets = inductive_miner_with_heuristic_net(log)
    if graphType is GraphType.petri_net:
        content = "petri_net"
        # TODO extension for additional graph types here
    elif graphType is GraphType.heuristic_net:
        content = json.dumps(heuNets.dfg_matrix)
        startActivities = [list(x.keys())[0] for x in heuNets.start_activities]
        endActivities = [list(x.keys())[0] for x in heuNets.end_activities]
        activities = heuNets.activities
    return {"content": content, "startActivities": startActivities, "endActivities": endActivities,
            "activities": activities}


@app.route('/data_constraint', methods=['POST'])
def dataConstraintEndPoint():
    json_object = request.get_json(force=True)
    mergeAttribute = json_object["merge_attribute"]
    pairs = json.loads(json_object["content"])
    outliers = detectOutliers(pairs)
    dataConstraint = detectDataLimitation(pairs, outliers, mergeAttribute)
    print("Computed Data Constraint:" + json.dumps(dataConstraint))
    return dataConstraint


if __name__ == '__main__':
    app.run(debug=True)
