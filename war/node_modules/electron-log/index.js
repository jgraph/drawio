'use strict';

var fs   = require('fs');
var path = require('path');
var util = require('util');
var EOL  = require('os').EOL;


var LEVELS = [ 'error', 'warn', 'info', 'verbose', 'debug', 'silly' ];

/**
 * @param {string|Object} text
 * @param {...Object} [objects]
 * @name module.exports.error
 */
/**
 * @param {string|Object} text
 * @param {...Object} [objects]
 * @name module.exports.warn
 */
/**
 * @param {string|Object} text
 * @param {...Object} [objects]
 * @name module.exports.info
 */
/**
 * @param {string|Object} text
 * @param {...Object} [objects]
 * @name module.exports.verbose
 */
/**
 * @param {string|Object} text
 * @param {...Object} [objects]
 * @name module.exports.debug
 */
/**
 * @param {string|Object} text
 * @param {...Object} [objects]
 * @name module.exports.silly
 */

module.exports.log = log;

module.exports.format = formatFile;

/**
 * Set this variable if you doesn't specify app name in package.json
 * @type {undefined|string}
 */
module.exports.appName = undefined;

module.exports.transports = {};
module.exports.transports.console = transportConsole;
module.exports.transports.console.format = formatConsole;
module.exports.transports.console.level = 'silly';

module.exports.transports.file = transportFile;
module.exports.transports.file.format = formatFile;
module.exports.transports.file.level = 'warn';
module.exports.transports.file.maxSize = 1024 * 1024;
module.exports.transports.file.streamConfig = undefined;

module.exports.findLogPath = findLogPath;

for (var i = 0; i < LEVELS.length; i++) {
  module.exports[LEVELS[i]] = log.bind(module.exports, LEVELS[i]);
}

/**
 * @param {string} level
 * @param {string} text
 */
function log(level, text) {
  var args = Array.prototype.slice.call(arguments, 1);
  args = args.map(function formatErrors(arg) {
    return arg instanceof Error ? arg.stack + EOL : arg;
  });
  text = util.format.apply(util, args);

  var msg = {
    level: level,
    text: text,
    date: new Date()
  };

  var transports = module.exports.transports;
  for (var i in transports) {
    // jshint -W089
    if (!transports.hasOwnProperty(i) || typeof transports[i] !== 'function') {
      continue;
    }
    if (!compareLevels(transports[i].level, level)) {
      continue;
    }
    transports[i].call(module.exports, msg);
  }
}

function compareLevels(passLevel, checkLevel) {
  var pass = LEVELS.indexOf(passLevel);
  var check = LEVELS.indexOf(checkLevel);
  if (check === -1 || pass === -1) {
    return true;
  }
  return check <= pass;
}

// region transport
function transportConsole(msg) {
  var text = format(msg, transportConsole.format || module.exports.format);
  if (console[msg.level]) {
    console[msg.level](text);
  } else {
    console.log(text);
  }
}

function transportFile(msg) {
  var text = format(msg, transportFile.format || module.exports.format);

  if (undefined === transportFile.stream) {
    transportFile.file = transportFile.file || findLogPath(module.exports.appName);
    if (!transportFile.file) {
      transportFile.stream = false;
      log('warn', 'electron-log.transports.file: Could not set a log file');
      return;
    }

    if (transportFile.maxSize > 0) {
      logRotate(transportFile.file, transportFile.maxSize);
    }

    transportFile.stream = fs.createWriteStream(
      transportFile.file,
      transportFile.streamConfig || { flags: 'a' }
    );
  }

  if (!transportFile.stream) {
    return;
  }

  transportFile.stream.write(text + EOL);
}

function logRotate(file, maxSize) {
  try {
    const stat = fs.statSync(file);
    if (stat.size > maxSize) {
      fs.renameSync(file, file.replace(/log$/, 'old.log'));
    }
  } catch (e) {}
}
// endregion transport

// region get log path
/**
 * Try to determine a platform-specific path where can write logs
 * @param {string} [appName] App name, path-safe, loads by package.json by default
 * @return {string|boolean}
 */
function findLogPath(appName) {
  appName = appName || findAppName();
  if (!appName) {
    return false;
  }

  var dir;
  switch (process.platform) {
    case 'linux':
      dir = prepareDir(process.env['XDG_CONFIG_HOME'], appName)
        .or(process.env['HOME'], '.config', appName)
        .or(process.env['XDG_DATA_HOME'], appName)
        .or(process.env['HOME'], '.local', 'share', appName)
        .result;
      break;
    case 'darwin':
      dir = prepareDir(process.env['HOME'], 'Library', 'Logs', appName)
        .or(process.env['HOME'], 'Library', 'Application Support', appName)
        .result;
      break;
    case 'win32':
      dir = prepareDir(process.env['APPDATA'], appName)
        .or(process.env['USERPROFILE'], 'AppData', 'Roaming', appName)
        .result;
      break;
  }

  if (dir) {
    return path.join(dir, 'log.log');
  } else {
    return false;
  }

  function findAppName() {
    var appName;
    try {
      var appPkg = loadAppPackage();
      if (!appPkg || (!appPkg.productName && !appPkg.name)) {
        transportFile.stream = false;
        log('warn', 'electron-log cannot read a name from package.json');
        return false;
      }
      appName = appPkg.productName || appPkg.name;
    } catch (e) {
      transportFile.stream = false;
      log('warn', 'electron-log: ' + e.message);
      return false;
    }
    return appName;
  }

  function prepareDir(dirPath) {
    // jshint -W040
    if (!this || this.or !== prepareDir || !this.result) {
      if (!dirPath) {
        return { or: prepareDir };
      }
      dirPath = path.join.apply(path, arguments);
      mkDir(dirPath);
      try {
        fs.accessSync(dirPath, fs.W_OK);
      } catch (e) {
        return { or: prepareDir };
      }
    }

    return {
      or: prepareDir,
      result: (this ? this.result : false) || dirPath
    };
  }

  function mkDir(dirPath, root) {
    var dirs = dirPath.split(path.sep);
    var dir = dirs.shift();
    root = (root || '') + dir + path.sep;

    try {
      fs.mkdirSync(root);
    }
    catch (e) {
      if (!fs.statSync(root).isDirectory()) {
        throw new Error(e);
      }
    }

    return !dirs.length || mkDir(dirs.join(path.sep), root);
  }
}

/**
 * Try to load main app package
 * @throws {Error}
 * @return {Object|null}
 */
function loadAppPackage() {
  var packageFile;
  try {
    packageFile = find(path.dirname(require.main.filename));
  } catch (e) {}
  if (!packageFile && process.resourcesPath) {
    packageFile = find(path.join(process.resourcesPath, 'app.asar'));
  }
  if (!packageFile) {
    packageFile = find(process.cwd());
  }
  if (!packageFile) {
    return null;
  }

  var content = fs.readFileSync(packageFile, 'utf-8');
  return JSON.parse(content);


  function find(root) {
    var file;
    while (!file) {
      var parent;
      file = path.join(root, 'package.json');
      try {
        fs.statSync(file);
      } catch (e) {
        parent = path.resolve(root, '..');
        file = null;
      }
      if (root === parent) {
        break;
      }
      root = parent;
    }
    return file;
  }
}
// endregion get log path

// region formatter
function format(msg, formatter) {
  if (typeof formatter === 'function') {
    return formatter(msg);
  }

  var date = msg.date;

  return formatter
    .replace('{level}', msg.level)
    .replace('{text}', msg.text)
    .replace('{y}', date.getFullYear())
    .replace('{m}', pad(date.getMonth() + 1))
    .replace('{d}', pad(date.getDate()))
    .replace('{h}', pad(date.getHours()))
    .replace('{i}', pad(date.getMinutes()))
    .replace('{s}', pad(date.getSeconds()))
    .replace('{ms}', pad(date.getMilliseconds(), 4));
}

function formatConsole(msg) {
  var time =
    pad(msg.date.getHours()) + ':' +
    pad(msg.date.getMinutes()) + ':' +
    pad(msg.date.getSeconds()) + ':' +
    pad(msg.date.getMilliseconds(), 4);

  return '[' + time + '] [' + msg.level + '] ' + msg.text;
}

function formatFile(msg) {
  var date =
    msg.date.getFullYear() + '-' +
    pad(msg.date.getMonth() + 1) + '-' +
    pad(msg.date.getDate()) + ' ' +
    pad(msg.date.getHours()) + ':' +
    pad(msg.date.getMinutes()) + ':' +
    pad(msg.date.getSeconds()) + ':' +
    pad(msg.date.getMilliseconds(), 4);

  return '[' + date + '] [' + msg.level + '] ' + msg.text;
}

function pad(number, zeros) {
  zeros = zeros || 2;
  return (new Array(zeros + 1).join('0') + number).substr(-zeros, zeros);
}
// endregion formatter
