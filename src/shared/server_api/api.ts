import axios from "axios";
import {ClientMessage, GraphType, ServerResponse} from "./types";

const REACT_APP_SERVER_ENDPOINT = "localhost"
const myAxios = axios.create({
    baseURL: REACT_APP_SERVER_ENDPOINT,
    timeout: 10_000,
});

export async function requestHeuristicMiner(type: GraphType = GraphType.heuristic_net, ...xesStrings: string[]) {
    const data : ClientMessage = {
        graph_type: GraphType.heuristic_net,
        data: xesStrings
    }
    const response= await myAxios.post<ServerResponse>("/heuristic_miner", data).catch(e => {
        throw e;
    });
    return response;
}
