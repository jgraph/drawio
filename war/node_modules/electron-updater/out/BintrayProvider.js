"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BintrayProvider = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _electronBuilderHttp;

function _load_electronBuilderHttp() {
    return _electronBuilderHttp = require("electron-builder-http");
}

var _bintray;

function _load_bintray() {
    return _bintray = require("electron-builder-http/out/bintray");
}

var _CancellationToken;

function _load_CancellationToken() {
    return _CancellationToken = require("electron-builder-http/out/CancellationToken");
}

var _api;

function _load_api() {
    return _api = require("./api");
}

class BintrayProvider extends (_api || _load_api()).Provider {
    constructor(configuration) {
        super();
        this.client = new (_bintray || _load_bintray()).BintrayClient(configuration, new (_CancellationToken || _load_CancellationToken()).CancellationToken());
    }
    getLatestVersion() {
        var _this = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            try {
                const data = yield _this.client.getVersion("_latest");
                return {
                    version: data.name
                };
            } catch (e) {
                if ("response" in e && e.response.statusCode === 404) {
                    throw new Error(`No latest version, please ensure that user, package and repository correctly configured. Or at least one version is published. ${e.stack || e.message}`);
                }
                throw e;
            }
        })();
    }
    getUpdateFile(versionInfo) {
        var _this2 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            try {
                const files = yield _this2.client.getVersionFiles(versionInfo.version);
                const suffix = `${versionInfo.version}.exe`;
                const file = files.find(function (it) {
                    return it.name.endsWith(suffix) && it.name.indexOf("Setup") !== -1;
                }) || files.find(function (it) {
                    return it.name.endsWith(suffix);
                }) || files.find(function (it) {
                    return it.name.endsWith(".exe");
                });
                if (file == null) {
                    //noinspection ExceptionCaughtLocallyJS
                    throw new Error(`Cannot find suitable file for version ${versionInfo.version} in: ${JSON.stringify(files, null, 2)}`);
                }
                return {
                    name: file.name,
                    url: `https://dl.bintray.com/${_this2.client.owner}/${_this2.client.repo}/${file.name}`,
                    sha2: file.sha256
                };
            } catch (e) {
                if (e instanceof (_electronBuilderHttp || _load_electronBuilderHttp()).HttpError && e.response.statusCode === 404) {
                    throw new Error(`No latest version, please ensure that user, package and repository correctly configured. Or at least one version is published. ${e.stack || e.message}`);
                }
                throw e;
            }
        })();
    }
}
exports.BintrayProvider = BintrayProvider; //# sourceMappingURL=BintrayProvider.js.map