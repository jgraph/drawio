"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
let impl;
if (process.platform === "win32") {
    impl = new (require("./NsisUpdater").NsisUpdater)();
} else if (process.platform === "darwin") {
    impl = new (require("./MacUpdater").MacUpdater)();
} else {
    impl = require("electron").autoUpdater;
}
const autoUpdater = exports.autoUpdater = impl;
//# sourceMappingURL=main.js.map