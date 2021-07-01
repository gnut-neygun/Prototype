export default `digraph "results\\manufacturing_algo_1" {
\tgraph [newrank=true]
\tsubgraph cluster_GetMT45State {
\t\t"Check State5"
\t\tstart_GetMT45State -> "Check State5"
\t\t"Check State5"
\t\t"Check State5" -> end_GetMT45State
\t}
\tsubgraph cluster_MT45AuxOn {
\t\tSet7
\t\tstart_MT45AuxOn -> Set7
\t\t"Check State7"
\t\t"Check State7" -> end_MT45AuxOn
\t}
\tsubgraph cluster_MT45ModeAuto {
\t\tSet2
\t\tstart_MT45ModeAuto -> Set2
\t\t"Check State2"
\t\t"Check State2" -> end_MT45ModeAuto
\t}
\tsubgraph cluster_GV12TurnMachining {
\t\tFetch3
\t\tstart_GV12TurnMachining -> Fetch3
\t\tFetch3
\t\tFetch3 -> end_GV12TurnMachining
\t}
\tsubgraph cluster_MT45Clamp2Open {
\t\tSet6
\t\tstart_MT45Clamp2Open -> Set6
\t\t"Check State6"
\t\t"Check State6" -> end_MT45Clamp2Open
\t}
\tsubgraph cluster_MT45NCStart {
\t\tSet1
\t\tstart_MT45NCStart -> Set1
\t\t"Check State1"
\t\t"Check State1" -> end_MT45NCStart
\t\t"Check State1"
\t\t"Check State1" -> "Check State1" [label=" (144) 0.993"]
\t}
\tsubgraph cluster_GV12TurnProduction {
\t\t"Detection Machining8"
\t\tstart_GV12TurnProduction -> "Detection Machining8"
\t\tMachining8
\t\tMachining8 -> end_GV12TurnProduction
\t}
\tsubgraph cluster_MT45DoorClose {
\t\tSet4
\t\tstart_MT45DoorClose -> Set4
\t\t"Check State4"
\t\t"Check State4" -> end_MT45DoorClose
\t\t"Check State4"
\t\t"Check State4" -> "Check State4" [label=" (935) 0.999"]
\t}
\tsubgraph cluster_SpawnGV12Production {
\t\t"GV12 Turn9"
\t\tstart_SpawnGV12Production -> "GV12 Turn9"
\t\t"Measure with MicroVu9"
\t\t"Measure with MicroVu9" -> end_SpawnGV12Production
\t\t"Manually Measure9"
\t\t"Manually Measure9" -> end_SpawnGV12Production
\t}
{rank=same;"start_GetMT45State"; "start_MT45AuxOn"; "start_MT45ModeAuto"; "start_GV12TurnMachining"; "start_MT45Clamp2Open"; "start_MT45NCStart"; "start_GV12TurnProduction"; "start_MT45DoorClose"; "start_SpawnGV12Production";}
}`
