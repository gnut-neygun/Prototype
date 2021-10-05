from enum import Enum, auto


class AutoName(Enum):
    def _generate_next_value_(name, start, count, last_values):
        return name


class GraphType(AutoName):
    petri_net = auto()
    heuristic_net = auto()
