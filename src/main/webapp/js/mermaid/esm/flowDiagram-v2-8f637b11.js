import { p as parser, f as flowDb } from "./add-html-label-f03d886c.js";
import { f as flowRendererV2, a as flowStyles } from "./styles-81d00864.js";
import { h as setConfig } from "./config-69acf485.js";
import "./utils-f7327cf6.js";
import "./setupGraphViewbox-7e84bca9.js";
import "./commonDb-79d171e7.js";
import "./mermaidAPI-40d20433.js";
import "./errorRenderer-11af1d78.js";
import "./isPlainObject-5aba0d95.js";
import "./array-b7dcf730.js";
import "./constant-b644328d.js";
import "./index-d98fbf22.js";
import "./index-519bdd45.js";
import "./edges-fcd5e1c4.js";
import "./svgDraw-5fe314a9.js";
import "./selectAll-63396edc.js";
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
//# sourceMappingURL=flowDiagram-v2-8f637b11.js.map
