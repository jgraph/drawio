"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GenericProvider = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

exports.validateUpdateInfo = validateUpdateInfo;

var _api;

function _load_api() {
    return _api = require("./api");
}

var _url;

function _load_url() {
    return _url = _interopRequireWildcard(require("url"));
}

var _path = _interopRequireWildcard(require("path"));

var _electronBuilderHttp;

function _load_electronBuilderHttp() {
    return _electronBuilderHttp = require("electron-builder-http");
}

var _CancellationToken;

function _load_CancellationToken() {
    return _CancellationToken = require("electron-builder-http/out/CancellationToken");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class GenericProvider extends (_api || _load_api()).Provider {
    constructor(configuration) {
        super();
        this.configuration = configuration;
        this.baseUrl = (_url || _load_url()).parse(this.configuration.url);
        this.channel = this.configuration.channel ? (0, (_api || _load_api()).getCustomChannelName)(this.configuration.channel) : (0, (_api || _load_api()).getDefaultChannelName)();
    }
    getLatestVersion() {
        var _this = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            let result = null;
            const channelFile = (0, (_api || _load_api()).getChannelFilename)(_this.channel);
            const pathname = _path.posix.resolve(_this.baseUrl.pathname || "/", channelFile);
            try {
                const options = {
                    hostname: _this.baseUrl.hostname,
                    path: `${pathname}${_this.baseUrl.search || ""}`,
                    protocol: _this.baseUrl.protocol,
                    headers: _this.requestHeaders || undefined
                };
                if (_this.baseUrl.port != null) {
                    options.port = parseInt(_this.baseUrl.port, 10);
                }
                result = yield (0, (_electronBuilderHttp || _load_electronBuilderHttp()).request)(options, new (_CancellationToken || _load_CancellationToken()).CancellationToken());
            } catch (e) {
                if (e instanceof (_electronBuilderHttp || _load_electronBuilderHttp()).HttpError && e.response.statusCode === 404) {
                    throw new Error(`Cannot find channel "${channelFile}" update info: ${e.stack || e.message}`);
                }
                throw e;
            }
            validateUpdateInfo(result);
            if ((0, (_api || _load_api()).getCurrentPlatform)() === "darwin") {
                result.releaseJsonUrl = (_url || _load_url()).format(Object.assign({}, _this.baseUrl, { pathname: pathname }));
            }
            return result;
        })();
    }
    getUpdateFile(versionInfo) {
        var _this2 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            if ((0, (_api || _load_api()).getCurrentPlatform)() === "darwin") {
                return versionInfo;
            }
            return {
                name: _path.posix.basename(versionInfo.path),
                url: (_url || _load_url()).format(Object.assign({}, _this2.baseUrl, { pathname: _path.posix.resolve(_this2.baseUrl.pathname || "/", versionInfo.path) })),
                sha2: versionInfo.sha2
            };
        })();
    }
}
exports.GenericProvider = GenericProvider; // sha2 is required only for windows because on macOS update is verified by Squirrel.Mac

function validateUpdateInfo(info) {
    if ((0, (_api || _load_api()).getCurrentPlatform)() === "darwin") {
        if (info.url == null) {
            throw new Error("Update info doesn't contain url");
        }
        return;
    }
    if (info.sha2 == null) {
        throw new Error(`Update info doesn't contain sha2 checksum: ${JSON.stringify(info, null, 2)}`);
    }
    if (info.path == null) {
        throw new Error(`Update info doesn't contain file path: ${JSON.stringify(info, null, 2)}`);
    }
}
//# sourceMappingURL=GenericProvider.js.map