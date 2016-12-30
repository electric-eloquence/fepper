'use strict';

const fs = require('fs-extra');
const JSON = require('json5');
const path = require('path');
const yaml = require('js-yaml');

const enc = 'utf8';

// ///////////////////////////////////////////////////////////////////////////
// Conf and global vars.
// ///////////////////////////////////////////////////////////////////////////
exports.conf = function () {
  var conf;
  var confStr;
  var defaults;
  var defaultsStr;
  var yml;

  // Return if global.conf already set.
  if (global.conf) {
    return global.conf;
  }

  // Get default confs for Fepper core.
  try {
    yml = fs.readFileSync(`${global.appDir}/excludes/conf.yml`, enc);
    defaults = yaml.safeLoad(yml);
  }
  catch (err) {
    exports.error(err);
    exports.error('Missing or malformed app/excludes/conf.yml! Exiting!');
    return;
  }

  // Get default confs for UI.
  try {
    defaultsStr = fs.readFileSync(`${global.appDir}/excludes/patternlab-config.json`);
    defaults.ui = JSON.parse(defaultsStr);
    exports.normalizeUiPaths(defaults.ui);
  }
  catch (err) {
    exports.error(err);
    exports.error('Missing or malformed app/excludes/patternlab-config.json! Exiting!');
    return;
  }

  // Putting enc here for possible future configurability.
  defaults.enc = enc;

  // Get custom confs for Fepper core.
  try {
    yml = fs.readFileSync(`${global.workDir}/conf.yml`, enc);
    conf = yaml.safeLoad(yml);
  }
  catch (err) {
    exports.error(err);
    exports.error('Missing or malformed conf.yml! Exiting!');
    return;
  }

  // Retrieve custom values for UI.
  try {
    confStr = fs.readFileSync(`${global.workDir}/patternlab-config.json`, enc);
    conf.ui = JSON.parse(confStr);
    exports.normalizeUiPaths(conf.ui);
  }
  catch (err) {
    exports.error(err);
    exports.error('Missing or malformed patternlab-config.json! Exiting!');
    return;
  }

  // Update Pattern Lab paths.
  try {
    conf.ui.paths.core = {
      lib: 'app/ui/core/lib'
    };
  }
  catch (err) {
    exports.error('Missing or malformed app/excludes/patternlab-config.json! Exiting!');
    return;
  }

  // Override defaults with custom values.
  exports.mergeObjects(defaults, conf);
  global.conf = conf;

  return conf;
};

// The difference between confs and prefs is that confs are mandatory.
exports.pref = function () {
  var pref;
  var defaults;
  var yml;

  try {
    yml = fs.readFileSync(`${global.appDir}/excludes/pref.yml`, enc);
    defaults = yaml.safeLoad(yml);
  }
  catch (err) {
    exports.error(err);
    exports.error('Missing or malformed excludes/pref.yml! Exiting!');
    return;
  }

  defaults.gh_pages_src = null;

  try {
    yml = fs.readFileSync(`${global.workDir}/pref.yml`, enc);
    pref = yaml.safeLoad(yml);
  }
  catch (err) {
    exports.error(err);
    exports.error('Missing or malformed pref.yml! Exiting!');
    return;
  }

  exports.mergeObjects(defaults, pref);
  global.pref = pref;

  return pref;
};

exports.data = function () {
  var data = {};
  var dataStr;

  try {
    dataStr = fs.readFileSync(exports.pathResolve(`${global.conf.ui.paths.source.data}/data.json`), enc);
    data = JSON.parse(dataStr);
  }
  catch (err) {
    exports.error(err);
  }

  return data;
};

// ///////////////////////////////////////////////////////////////////////////
// Data utilities.
// ///////////////////////////////////////////////////////////////////////////
/**
 * Recursively merge properties of two objects.
 *
 * @param {object} obj1 - If obj1 has properties obj2 doesn't, add to obj2.
 * @param {object} obj2 - This object's properties have priority over obj1.
 *   Since obj2 gets mutated, the return value is only necessary for the purpose of referencing to a new variable.
 * @return {object} The mutated obj2 object.
 */
exports.mergeObjects = function (obj1, obj2) {
  for (var i in obj1) {
    if (obj1.hasOwnProperty(i)) {
      try {
        // Only recurse if obj1[i] is an object.
        if (obj1[i].constructor === Object) {
          // Requires 2 objects as params; create obj2[i] if undefined.
          if (typeof obj2[i] === 'undefined' || obj2[i] === null) {
            obj2[i] = {};
          }
          obj2[i] = exports.mergeObjects(obj1[i], obj2[i]);
        // Pop when recursion meets a non-object. If obj1[i] is a non-object,
        // only copy to undefined obj2[i]. This way, obj2 maintains priority.
        }
        else if (typeof obj2[i] === 'undefined' || obj2[i] === null) {
          obj2[i] = obj1[i];
        }
      }
      catch (err) {
        // Property in destination object not set; create it and set its value.
        if (typeof obj2[i] === 'undefined' || obj2[i] === null) {
          obj2[i] = obj1[i];
        }
      }
    }
  }

  return obj2;
};

exports.escapeReservedRegexChars = function (regexStr) {
  return regexStr.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
};

// ///////////////////////////////////////////////////////////////////////////
// File system utilities.
// ///////////////////////////////////////////////////////////////////////////
exports.backendDirCheck = function (backendDir) {
  var fullPath;
  var stats;

  if (typeof backendDir === 'string') {
    fullPath = `${exports.pathResolve(global.conf.backend_dir)}/${backendDir.trim()}`;

    try {
      stats = fs.statSync(fullPath);
    }
    catch (err) {
      // Fail gracefully.
    }

    if (stats && stats.isDirectory()) {
      return fullPath;
    }
  }

  return '';
};

exports.extCheck = function (ext) {
  var extTrimmed;

  if (typeof ext === 'string') {
    extTrimmed = ext.trim();
    if (extTrimmed.match(/^[\w\-\.\/]+$/)) {
      return extTrimmed;
    }
  }

  return '';
};

/**
 * Because Pattern Lab :-/
 * Need to remove leading dot-slashes from properties within the paths object in patternlab-config.json.
 * @param {object} uiObj - The UI configuration object.
 * @return {object} The mutated uiObj.
 */
exports.normalizeUiPaths = function (uiObj) {
  if (!uiObj || !uiObj.paths || !uiObj.paths.source) {
    throw 'Missing or malformed paths.source property!';
  }

  if (!uiObj.paths.public) {
    throw 'Missing or malformed paths.source property!';
  }

  var sourceObj = uiObj.paths.source;
  var publicObj = uiObj.paths.public;

  for (let i in sourceObj) {
    if (sourceObj.hasOwnProperty(i)) {
      if (sourceObj[i].slice(0, 2) === './') {
        sourceObj[i] = sourceObj[i].slice(2);
      }
    }
  }

  for (let i in publicObj) {
    if (publicObj.hasOwnProperty(i)) {
      if (publicObj[i].slice(0, 2) === './') {
        publicObj[i] = publicObj[i].slice(2);
      }
    }
  }

  return uiObj;
};

exports.pathResolve = function (relPath, normalize) {
  if (normalize) {
    return path.normalize(`${global.workDir}/${relPath}`);
  }
  else {
    return `${global.workDir}/${relPath}`;
  }
};

exports.findup = function (fileName, workDirParam) {
  var dirMatch = null;
  var workDir = path.normalize(`${workDirParam}/..`);
  var files = fs.readdirSync(workDir);

  if (files.indexOf(fileName) > -1) {
    return workDir;
  }
  else if (workDir !== '/') {
    dirMatch = exports.findup(fileName, workDir);
  }
  else {
    return null;
  }

  return dirMatch;
};

// ///////////////////////////////////////////////////////////////////////////
// Logging.
// ///////////////////////////////////////////////////////////////////////////
exports.console = console; // To not trigger eslint errors on assignment.

exports.isTest = function () {
  var isGulp = false;
  var isTest = false;

  for (var i = 0; i < process.argv.length; i++) {
    if (process.argv[i].slice(-5) === 'mocha') {
      isTest = true;
      break;
    }
    else if (process.argv[i].slice(-4) === 'gulp') {
      isGulp = true;
    }
    else if (isGulp && process.argv[i] === 'test') {
      isTest = true;
      break;
    }
  }

  return isTest;
};

exports.i = function (obj, depthParam, showHidden) {
  var depth = depthParam ? depthParam : null;
  return exports.console.dir(obj, {showHidden: showHidden, depth: depth});
};

exports.error = exports.console.error;

exports.info = exports.console.info;

exports.log = exports.isTest() ? function () {} : exports.console.log;

exports.warn = exports.console.warn;

// ///////////////////////////////////////////////////////////////////////////
// Webserved directories.
// ///////////////////////////////////////////////////////////////////////////
/**
 * Remove first path element from webservedDirsFull and save to array.
 *
 * @param {array} webservedDirsFull - The array of webserved directories.
 * @return {array} The webserved directories stripped of configuration prefix.
 */
exports.webservedDirnamesTruncate = function (webservedDirsFull) {
  if (!webservedDirsFull || !webservedDirsFull.length) {
    return [];
  }

  var i;
  var webservedDirSplit;
  var webservedDirsShort = [];

  for (i = 0; i < webservedDirsFull.length; i++) {
    webservedDirSplit = webservedDirsFull[i].split('/');
    webservedDirSplit.shift();
    webservedDirsShort.push(webservedDirSplit.join('/'));
  }

  return webservedDirsShort;
};

/**
 * Copy webserved_dirs to static site dir.
 *
 * @param {array} webservedDirsFull - Path to directories webserved by Fepper.
 * @param {array} webservedDirsShort - Path to directories webserved by Fepper
 *   truncated for publishing to static site.
 * @param {string} staticDir - The destination directory.
 */
exports.webservedDirsCopy = function (webservedDirsFull, webservedDirsShort, staticDir) {
  var i;

  for (i = 0; i < webservedDirsFull.length; i++) {
    fs.copySync(
      `${exports.pathResolve(global.conf.backend_dir)}/${webservedDirsFull[i]}`,
      `${staticDir}/${webservedDirsShort[i]}`
    );
  }
};
