"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CancellationError = exports.CancellationToken = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = _interopRequireDefault(require("bluebird-lst"));
}

var _events;

function _load_events() {
    return _events = require("events");
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CancellationToken extends (_events || _load_events()).EventEmitter {
    // babel cannot compile ... correctly for super calls
    constructor(parent) {
        super();
        this.parentCancelHandler = null;
        this._cancelled = false;
        if (parent != null) {
            this.parent = parent;
        }
    }
    get cancelled() {
        return this._cancelled || this._parent != null && this._parent.cancelled;
    }
    set parent(value) {
        this.removeParentCancelHandler();
        this._parent = value;
        this.parentCancelHandler = () => this.cancel();
        this._parent.onCancel(this.parentCancelHandler);
    }
    cancel() {
        this._cancelled = true;
        this.emit("cancel");
    }
    onCancel(handler) {
        if (this.cancelled) {
            handler();
        } else {
            this.once("cancel", handler);
        }
    }
    createPromise(callback) {
        if (this.cancelled) {
            return (_bluebirdLst || _load_bluebirdLst()).default.reject(new CancellationError());
        }
        let cancelHandler = null;
        return new (_bluebirdLst || _load_bluebirdLst()).default((resolve, reject) => {
            let addedCancelHandler = null;
            cancelHandler = () => {
                try {
                    if (addedCancelHandler != null) {
                        addedCancelHandler();
                        addedCancelHandler = null;
                    }
                } finally {
                    reject(new CancellationError());
                }
            };
            if (this.cancelled) {
                cancelHandler();
                return;
            }
            this.onCancel(cancelHandler);
            callback(resolve, reject, callback => {
                addedCancelHandler = callback;
            });
        }).finally(() => {
            if (cancelHandler != null) {
                this.removeListener("cancel", cancelHandler);
                cancelHandler = null;
            }
        });
    }
    removeParentCancelHandler() {
        const parent = this._parent;
        if (parent != null && this.parentCancelHandler != null) {
            parent.removeListener("cancel", this.parentCancelHandler);
            this.parentCancelHandler = null;
        }
    }
    dispose() {
        try {
            this.removeParentCancelHandler();
        } finally {
            this.removeAllListeners();
            this._parent = null;
        }
    }
}
exports.CancellationToken = CancellationToken;
class CancellationError extends Error {
    constructor() {
        super("Cancelled");
    }
}
exports.CancellationError = CancellationError; //# sourceMappingURL=CancellationToken.js.map