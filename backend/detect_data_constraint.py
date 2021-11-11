import collections
import numbers
import statistics

from numpy import argmax, nan
from sklearn import preprocessing, tree
from sklearn.impute import SimpleImputer
from sklearn.tree import _tree


def detectOutliers(pairs):
    outli = list()
    for k, v in pairs:
        deltas = list()
        # durch lambda ersetzen. TODO
        for x in v:
            deltas.append(x[2])
        if len(deltas) < 2:
            continue
        m = statistics.mean(deltas)
        stdev = statistics.stdev(deltas)
        z_sc = list()
        for x in deltas:
            if stdev != 0:
                z_sc.append((x - m) / stdev)
            else:
                z_sc.append(float('nan'))
        for i in range(0, len(deltas)):
            if abs(z_sc[i]) > 3:
                outli.append(v[i])
    return outli


def detectDataLimitation(pairs, outliers, mergeAttribute):
    rules = dict()
    for key, value in pairs:
        instances = list()
        for pair in value:
            if pair in outliers:
                instances.append([pair[0], pair[1], True, pair[2]])
            else:
                instances.append([pair[0], pair[1], False, pair[2]])
        res = computeRules(instances, mergeAttribute)
        if (res):
            rules[key] = res
    return rules


def get_paths(val, l, c):
    for k, v in val.items():
        if (type(v) == dict):
            get_paths(val['left'], l, c + [(val['feature'], "<=", val['threshold'])])
            get_paths(val['right'], l, c + [(val['feature'], ">", val['threshold'])])
            return
    if val['class'] == 1:
        l.append(c)


def get_set(val):
    s = set()
    for k, v in val.items():
        if (type(v) == dict):
            s = s.union(get_set(v))
    s.add(val['class'])
    return s


def export_dict(tree, feature_names=None, max_depth=None):
    tree_ = tree.tree_

    def recur(i, depth=0):
        val = None
        if max_depth is not None and depth > max_depth:
            return None
        if i == _tree.TREE_LEAF:
            return None
        feature = int(tree_.feature[i])
        threshold = float(tree_.threshold[i])
        if feature == _tree.TREE_UNDEFINED:
            feature = None
            threshold = None
            value = (map(float, l) for l in tree_.value[i].tolist())
            val = tree_.value[i]
        else:
            value = None
            if feature_names:
                feature = feature_names[feature]
        return {'feature': feature, 'threshold': threshold, 'impurity': float(tree_.impurity[i]),
                'n_node_samples': int(tree_.n_node_samples[i]), 'left': recur(tree_.children_left[i], depth + 1),
                'right': recur(tree_.children_right[i], depth + 1), 'value': value, 'class': tree.classes_[
                argmax(val)]}

    return recur(0)


def computeRules(instances, mergeAttribute):
    le_dict = collections.defaultdict(preprocessing.LabelEncoder)
    attr = collections.OrderedDict()
    target_v = set()  # move to target []
    for pair in instances:
        target_v.add(pair[2])
        for akey, aval in pair[0].items():
            if "concept:" in akey or "lifecycle" in akey or "time:" in akey or "trace:" in akey or "uuid" in akey or akey == mergeAttribute:
                continue
            akey += "1"
            if akey not in attr:
                attr[akey] = set()
            attr[akey].add(aval)
        for akey, aval in pair[1].items():
            if "concept:" in akey or "lifecycle" in akey or "time:" in akey or "trace:" in akey or "uuid" in akey or akey == mergeAttribute:
                continue
            akey += "2"
            if akey not in attr:
                attr[akey] = set()
            attr[akey].add(aval)
    if not attr:
        return None
    for k, v in attr.items():
        t = list(v)
        if not isinstance(t[0], numbers.Number):
            le_dict[k].fit(list(v))
    target_names = list(target_v)
    le_dict['outlier'].fit(target_names)
    traces = list()
    targets = list()
    fn = str.join("_", [instances[0][0]["concept:name"], instances[0][1]["concept:name"]]).replace(" ", "")
    for pair in instances:
        targets.append(le_dict['outlier'].transform([pair[2]])[0])
        trace = []
        for k in attr:
            if "concept:" in k or "lifecycle" in k or "time:" in k or "trace:" in k or "uuid" in k or k == mergeAttribute:
                continue
            pair_id = k[-1]
            uid = k[:-1]
            if pair_id == "1":
                if uid not in pair[0]:
                    trace.append(nan)
                else:
                    if k in le_dict:
                        trace.append(le_dict[k].transform([pair[0][uid]])[0])
                    else:
                        trace.append(pair[0][uid])
            else:
                if uid not in pair[1]:
                    trace.append(nan)
                else:
                    if k in le_dict:
                        trace.append(le_dict[k].transform([pair[1][uid]])[0])
                    else:
                        trace.append(pair[1][uid])
        traces.append(trace)
    imp = SimpleImputer(missing_values=nan, strategy='mean')
    traces = imp.fit_transform(traces)
    clf = tree.DecisionTreeClassifier(max_depth=3, criterion='entropy')  # len(attr.keys()))
    clf = clf.fit(traces, targets)
    restree = export_dict(clf, list(attr.keys()))
    ll = list()
    if len(target_names) > 1 and len(get_set(restree)) > 1:
        get_paths(restree, ll, [])
    return ll
