import axios from "axios";

const REACT_APP_SERVER_ENDPOINT = "http://localhost:5000/"
const myAxios = axios.create({
    baseURL: REACT_APP_SERVER_ENDPOINT,
    timeout: 10_000,
});

export interface ServerResponse {
    content: string,
    startActivities: string[],
    endActivities: string[]
}

export interface ClientMessage {
    graph_type: GraphType,
    data: string
}

export enum GraphType {
    heuristic_net = "heuristic_net",
    petri_net = "petri_net",
    alpha_miner = "alpha_miner"
}

export async function requestHeuristicMiner(type: GraphType = GraphType.heuristic_net, xesString: string) {
    const data : ClientMessage = {
        graph_type: GraphType.heuristic_net,
        data: xesString
    }
    return await myAxios.post<ServerResponse>("/heuristic_miner", data);
}
