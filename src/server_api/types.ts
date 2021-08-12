export interface ServerResponse {

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
