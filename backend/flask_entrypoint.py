import json
from typing import List

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, fields, marshal_with
from pm4py.objects.log.importer.xes import importer as xes_importer

from backend.process_mining import inductive_miner_with_heuristic_net
from enums import GraphType

app = Flask(__name__)
CORS(app)  # Enable CORS for all route

api = Api(app)

response_format = {
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
@app.route('/<string:miner_algo>', methods = ['POST'])
def post(miner_algo):
    graphData: str = ""
    startActivities: List[str] = []
    endActivities: List[str] = []
    json_object = request.get_json(force=True)
    graphType = GraphType[json_object["graph_type"]]
    graphData : str = json_object["data"]
    log=xes_importer.deserialize(graphData)
    heuNets= inductive_miner_with_heuristic_net(log)
    if miner_algo == "heuristic_miner":
        if graphType is GraphType.petri_net:
            graphData = "petri_net"
        elif graphType is GraphType.heuristic_net:
            graphData = json.dumps(heuNets.dfg_matrix)
            startActivities = [list(x.keys())[0] for x in heuNets.start_activities]
            endActivities = [list(x.keys())[0] for x in heuNets.end_activities]
    elif miner_algo == "alpha_miner":
        graphData = "alpha_miner" + json_object["data"]
    else:
        graphData = "undefined"
    return {"content": graphData, "startActivities": startActivities, "endActivities": endActivities}

if __name__ == '__main__':
    app.run(debug=True)
