"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BintrayClient = undefined;
exports.bintrayRequest = bintrayRequest;

var _httpExecutor;

function _load_httpExecutor() {
    return _httpExecutor = require("./httpExecutor");
}

function bintrayRequest(path, auth) {
    let data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    let cancellationToken = arguments[3];
    let method = arguments[4];

    return (0, (_httpExecutor || _load_httpExecutor()).request)((0, (_httpExecutor || _load_httpExecutor()).configureRequestOptions)({ hostname: "api.bintray.com", path: path }, auth, method), cancellationToken, data);
}
class BintrayClient {
    constructor(options, cancellationToken, apiKey) {
        this.cancellationToken = cancellationToken;
        if (options.owner == null) {
            throw new Error("owner is not specified");
        }
        if (options.package == null) {
            throw new Error("package is not specified");
        }
        this.repo = options.repo || "generic";
        this.packageName = options.package;
        this.owner = options.owner;
        this.user = options.user || options.owner;
        this.auth = apiKey == null ? null : `Basic ${new Buffer(`${this.user}:${apiKey}`).toString("base64")}`;
        this.basePath = `/packages/${this.owner}/${this.repo}/${this.packageName}`;
    }
    getVersion(version) {
        return bintrayRequest(`${this.basePath}/versions/${version}`, this.auth, null, this.cancellationToken);
    }
    getVersionFiles(version) {
        return bintrayRequest(`${this.basePath}/versions/${version}/files`, this.auth, null, this.cancellationToken);
    }
    createVersion(version) {
        return bintrayRequest(`${this.basePath}/versions`, this.auth, {
            name: version
        }, this.cancellationToken);
    }
    deleteVersion(version) {
        return bintrayRequest(`${this.basePath}/versions/${version}`, this.auth, null, this.cancellationToken, "DELETE");
    }
}
exports.BintrayClient = BintrayClient; //# sourceMappingURL=bintray.js.map