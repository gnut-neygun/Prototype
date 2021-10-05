import os

from pm4py.algo.discovery.alpha import algorithm as alpha_miner
from pm4py.algo.discovery.heuristics import algorithm as heuristics_miner
from pm4py.algo.discovery.inductive import algorithm as inductive_miner
from pm4py.algo.filtering.log.attributes import attributes_filter
from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.visualization.petri_net import visualizer as pn_visualizer


def inductive_miner_with_petri_net(log):
    inductive_petri_net, initial_marking, final_marking = inductive_miner.apply(log)
    gviz = pn_visualizer.apply(inductive_petri_net, initial_marking, final_marking)
    pn_visualizer.view(gviz)
    return inductive_petri_net, initial_marking, final_marking


def inductive_miner_with_heuristic_net(log, mineRelative: float = 0.3):
    heu_net = heuristics_miner.apply_heu(log, parameters={
        heuristics_miner.Variants.CLASSIC.value.Parameters.DEPENDENCY_THRESH: mineRelative,
        heuristics_miner.Variants.CLASSIC.value.Parameters.MIN_ACT_COUNT: 100})
    # gviz = hn_visualizer.apply(heu_net)
    # hn_visualizer.view(gviz)
    return heu_net


def alpha_miner(log):
    net, im, fm = net, initial_marking, final_marking = alpha_miner.apply(log)

if __name__=="__main__":
    # log = xes_importer.apply(os.path.join("data", "manufacturing", "MT45AuxOn.xes"))
    log = xes_importer.apply(os.path.join("data", "post", "billinstances.xes"))
    # print(log.classifiers)
    filtered_log = log
    activities = attributes_filter.get_attribute_values(filtered_log, "lifecycle:transition")
    print(activities)

    # activities = attributes_filter.get_attribute_values(log, "lifecycle:transition")
    # print(activities)
    inductive_miner_with_heuristic_net(filtered_log)

#
# gviz = pn_visualizer.apply(inductive_petri_net, initial_marking, final_marking)
# pn_visualizer.view(gviz)
