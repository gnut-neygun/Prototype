import axios from "axios";
import {GraphType, ServerResponse} from "./types";

const {REACT_APP_SERVER_ENDPOINT} = process.env
const myAxios = axios.create({
    baseURL: REACT_APP_SERVER_ENDPOINT,
    timeout: 10_000,
});

export async function requestHeuristicMiner(graphType: GraphType, xesString: string) {
    return myAxios.post<ServerResponse>("/heuristic_miner", {
        graph_type: graphType, data: xesString
    }).catch(e => {
        throw e
    });
}
