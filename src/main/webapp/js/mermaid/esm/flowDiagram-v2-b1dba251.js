import { p as parser, f as flowDb } from "./flowDb-2cb10427.js";
import { f as flowRendererV2, a as flowStyles } from "./styles-aaf402de.js";
import { f as setConfig } from "./config-5161385b.js";
import "d3";
import "./utils-3cbdbddf.js";
import "@braintree/sanitize-url";
import "./setupGraphViewbox-e1099da8.js";
import "./commonDb-7528607a.js";
import "lodash-es/memoize.js";
import "./mermaidAPI-b25e2e7c.js";
import "stylis";
import "./errorRenderer-11917bdc.js";
import "dompurify";
import "lodash-es/isEmpty.js";
import "dagre-d3-es/src/graphlib/index.js";
import "./index-4f26300f.js";
import "dagre-d3-es/src/dagre/index.js";
import "dagre-d3-es/src/graphlib/json.js";
import "./edges-eed58ae2.js";
import "./svgDraw-87c143cd.js";
import "dagre-d3-es/src/dagre-js/label/add-html-label.js";
import "moment-mini";
import "khroma";
const diagram = {
  parser,
  db: flowDb,
  renderer: flowRendererV2,
  styles: flowStyles,
  init: (cnf) => {
    if (!cnf.flowchart) {
      cnf.flowchart = {};
    }
    cnf.flowchart.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    setConfig({ flowchart: { arrowMarkerAbsolute: cnf.arrowMarkerAbsolute } });
    flowRendererV2.setConf(cnf.flowchart);
    flowDb.clear();
    flowDb.setGen("gen-2");
  }
};
export {
  diagram
};
//# sourceMappingURL=flowDiagram-v2-b1dba251.js.map
