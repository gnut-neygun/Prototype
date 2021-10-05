from pm4py.objects.log.obj import EventLog, Trace


def filter_lifecycle_transition(log: EventLog, lifecycle_value: list[str])-> EventLog:
    filtered_log = EventLog(list(), attributes=log.attributes, extensions=log.extensions, classifiers=log.classifiers,
                            omni_present=log.omni_present, properties=log.properties)
    for trace in log:
        filtered_trace = Trace()
        for event in trace:
            if event["lifecycle:transition"] in lifecycle_value:
                filtered_trace.append(event)
        filtered_log.append(filtered_trace)
    return filtered_log
