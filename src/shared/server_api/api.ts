import axios from "axios";

let REACT_APP_SERVER_ENDPOINT = "http://localhost:5000/"
if (!import.meta.env.DEV) {
    REACT_APP_SERVER_ENDPOINT = "https://isc-prototype.herokuapp.com/"
}
const myAxios = axios.create({
    baseURL: REACT_APP_SERVER_ENDPOINT,
    timeout: 10_000,
});

export interface ServerResponse {
    content: string,
    startActivities: string[],
    endActivities: string[],
    activities: string[],
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

export interface RequestDataConstraintMessage {
    content: string,
    merge_attribute: string
}

export async function requestHeuristicMiner(type: GraphType = GraphType.heuristic_net, xesString: string) {
    const data: ClientMessage = {
        graph_type: GraphType.heuristic_net,
        data: xesString
    }
    return await myAxios.post<ServerResponse>("/heuristic_miner", data);
}

export async function requestDataConstraint(serializedEventPair: string, mergeAttribute: string) {
    const payload: RequestDataConstraintMessage = {
        content: serializedEventPair,
        merge_attribute: mergeAttribute
    }
    return await myAxios.post("/data_constraint", payload, {timeout: 20_000})
}
