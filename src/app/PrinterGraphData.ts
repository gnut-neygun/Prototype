export const PrinterGraphData = `digraph "results\\printer_algo_1" {
\tgraph [newrank=true]
\tsubgraph cluster_billinstances {
\t\t"write bill"
\t\tstart_billinstances -> "write bill"
\t\t"deliver bill"
\t\t"deliver bill" -> end_billinstances
\t\t"deliver bill"
\t\t"write bill"
\t\t"print bill"
\t\t"write bill" -> "print bill" [label=" (1800) 0.999"]
\t\t"print bill" -> "deliver bill" [label=" (1800) 0.999"]
\t}
\tsubgraph cluster_flyerinstances {
\t\t"receive flyer order"
\t\tstart_flyerinstances -> "receive flyer order"
\t\t"deliver flyer"
\t\t"deliver flyer" -> end_flyerinstances
\t\t"print flyer"
\t\t"send draft to customer"
\t\t"receive flyer order"
\t\t"deliver flyer"
\t\t"design flyer"
\t\t"receive flyer order" -> "design flyer" [label=" (900) 0.999"]
\t\t"design flyer" -> "send draft to customer" [label=" (1809) 0.331"]
\t\t"send draft to customer" -> "print flyer" [label=" (900) 0.999"]
\t\t"print flyer" -> "deliver flyer" [label=" (900) 0.999"]
\t}
\tsubgraph cluster_posterinstances {
\t\t"receive order and photo"
\t\tstart_posterinstances -> "receive order and photo"
\t\t"deliver poster"
\t\t"deliver poster" -> end_posterinstances
\t\t"deliver poster"
\t\t"print poster"
\t\t"receive order and photo"
\t\t"design photo poster"
\t\t"receive order and photo" -> "design photo poster" [label=" (900) 0.999"]
\t\t"design photo poster" -> "print poster" [label=" (900) 0.999"]
\t\t"print poster" -> "deliver poster" [label=" (900) 0.999"]
\t}
\t"deliver poster" [style=filled]
\t"deliver flyer" [style=filled]
\t"deliver bill" [style=filled]
\t"deliver poster" -> "deliver bill" [arrowhead=none color=red style=dashed]
\t"deliver poster" [style=filled]
\t"deliver bill" [style=filled]
\t"deliver bill" -> "deliver flyer" [arrowhead=none color=red style=dashed]
\t"deliver bill" [style=filled]
\t"deliver flyer" [style=filled]
\t"deliver poster" -> "deliver flyer" [arrowhead=none color=red style=dashed]
\t"deliver poster" [style=filled]
\t"deliver flyer" [style=filled]
{rank=same;"start_billinstances"; "start_flyerinstances"; "start_posterinstances";}
}
`
