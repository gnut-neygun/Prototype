import json
from typing import List

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource, fields, marshal_with
from pm4py.objects.log.importer.xes import importer as xes_importer

from backend.process_mining import inductive_miner_with_heuristic_net
from enums import GraphType

app = Flask(__name__)
CORS(app)  # Enable CORS for all route

api = Api(app)

response_format = {
    'gviz': fields.String,
}


# Example request
# {
#     "graph_type": "heuristic_net",
#     "data": ["contentlog1", "contentlog2"]  # Should be data in a xes file
# }
class Miners(Resource):
    @marshal_with(response_format)
    def post(self, miner_algo):
        gvizData: str = ""
        json_object = request.get_json(force=True)
        graphType = GraphType[json_object["graph_type"]]
        graphData : List[str] = json_object["data"]
        logs=list(map(lambda logContent: xes_importer.deserialize(log_string=logContent), graphData))
        heuNets= list(map(lambda log: inductive_miner_with_heuristic_net(log), logs))
        if miner_algo == "heuristic_miner":
            if graphType is GraphType.petri_net:
                gvizData = "petri_net"
            elif graphType is GraphType.heuristic_net:
                gvizData = json.dumps(heuNets)
        elif miner_algo == "alpha_miner":
            gvizData = "alpha_miner" + json_object["data"]
        else:
            gvizData = "undefined"
        return {"gviz": gvizData}


api.add_resource(Miners, '/<string:miner_algo>')

if __name__ == '__main__':
    app.run(debug=True)
