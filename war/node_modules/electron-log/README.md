# electron-log
[![Build Status](https://travis-ci.org/megahertz/electron-log.svg?branch=master)](https://travis-ci.org/megahertz/electron-log)
[![npm version](https://badge.fury.io/js/electron-log.svg)](https://badge.fury.io/js/electron-log)

## Description

Just a very simple logging module for your Electron or NW.js application.
No dependencies. No complicated configuration. Just require and use.
Also it can be used without Electron.

By default it writes logs to the following locations:

 * **on Linux:** `~/.config/<app name>/log.log`
 * **on OS X:** `~/Library/Logs/<app name>/log.log`
 * **on Windows:** `%USERPROFILE%\AppData\Roaming\<app name>\log.log`

## Installation

Install with [npm](https://npmjs.org/package/electron-log):

    npm install electron-log

## Usage

```js
var log = require('electron-log');

log.info('Hello, log');
```
    

### Transport
Transport is a simple function which requires an object which describes a message.
By default, two transports are active: console and file. The file path is 
dependent on current platform.

#### Disable default transport:

```js
log.transports.file = false;
log.transports.console = false;
```
    
#### Override transport:

```js
log.transports.console = function(msg) {
  console.log(`[${msg.date.toLocaleTimeString()} ${msg.level}] ${msg.text}`);
};
```
    
#### Console Transport

```js
// Log level
log.transports.console.level = 'warn';

/** 
 * Set output format template. Available variables:
 * Main: {level}, {text}
 * Date: {y},{m},{d},{h},{i},{s},{ms}
 */
log.transports.console.format = '{h}:{i}:{s}:{ms} {text}';

// Set a function which formats output
log.transports.console.format = (msg) => msg.text;
```
    
#### File transport

```js
// Same as for console transport
log.transports.file.level = 'warn';
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

// Set maximum log size in bytes. When it exceeds, old log will be saved
// as log.old.log file
log.transports.file.maxSize = 5 * 1024 * 1024;

// Write to this file, must be set before first logging
log.transports.file.file = __dirname + '/log.txt';

// fs.createWriteStream options, must be set before first logging
log.transports.file.streamConfig = { flags: 'w' };

// set existed file stream
log.transports.file.stream = fs.createWriteStream('log.txt');
```

By default, file transport reads a productName or name property from package.json to
determine a log path like `~/.config/<app name>/log.log`.
If you have no package.json or you want to specify another <app name>,
just set the appName property:

```js
log.appName = 'test';
```

## Change Log

**1.3.0**

- #18 Rename 'warning' log level to 'warn'

**1.2.0**

 - #14 Use native console levels instead of console.log
 
**1.0.16**

 - Prefer to use package.json:productName instead of package.json:name to
 determine a log path. 

## License

Licensed under MIT.
