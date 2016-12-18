'use strict';

var fs = require('fs-extra');
var JSON = require('json5');
var path = require('path');
var util = require('util');
var yaml = require('js-yaml');

var enc = 'utf8';

// ///////////////////////////////////////////////////////////////////////////
// Conf and global vars.
// ///////////////////////////////////////////////////////////////////////////
exports.conf = function () {
  var conf;
  var confStr;
  var defaults;
  var yml;

  // Return if global.conf already set.
  if (global.conf) {
    return global.conf;
  }

  // Get default confs for Fepper core.
  try {
    yml = fs.readFileSync(global.appDir + '/excludes/conf.yml', enc);
    defaults = yaml.safeLoad(yml);
  }
  catch (err) {
    exports.error(err);
    exports.error('Missing or malformed app/excludes/conf.yml! Exiting!');
    return;
  }

  // Get default confs for UI.
  try {
    defaults.ui = require(global.appDir + '/excludes/patternlab-config.json');
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
    yml = fs.readFileSync(global.workDir + '/conf.yml', enc);
    conf = yaml.safeLoad(yml);
  }
  catch (err) {
    exports.error(err);
    exports.error('Missing or malformed conf.yml! Exiting!');
    return;
  }

  // Retrieve custom values for UI.
  try {
    confStr = fs.readFileSync(global.workDir + '/patternlab-config.json', enc);
    conf.ui = JSON.parse(confStr);
  }
  catch (err) {
    exports.error(err);
    exports.error('Missing or malformed patternlab-config.json! Exiting!');
    return;
  }

  // Update Pattern Lab paths.
  try {
    conf.ui.paths.core = {
      lib: './app/ui/core/lib'
    };
    conf.ui.paths.source.data += '/';
    conf.ui.paths.public.patterns += '/';
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
    yml = fs.readFileSync(global.appDir + '/excludes/pref.yml', enc);
    defaults = yaml.safeLoad(yml);
  }
  catch (err) {
    exports.error(err);
    exports.error('Missing or malformed excludes/pref.yml! Exiting!');
    return;
  }

  defaults.gh_pages_src = null;

  try {
    yml = fs.readFileSync(global.workDir + '/pref.yml', enc);
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
    dataStr = fs.readFileSync(exports.pathResolve(global.conf.ui.paths.source.data + '/data.json'), enc);
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
 *   If obj2 is null or undefined, be sure to make an assignment to the output
 *   of this function. In other cases, obj2 get mutated, and no assignment is
 *   necessary.
 * @return {object} The mutated obj2 object.
 */
exports.mergeObjects = function (obj1, obj2) {
  obj2 = obj2 || {};

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

// ///////////////////////////////////////////////////////////////////////////
// File system utilities.
// ///////////////////////////////////////////////////////////////////////////
exports.backendDirCheck = function (backendDir) {
  var fullPath;
  var stats;

  if (typeof backendDir === 'string') {
    fullPath = exports.pathResolve('backend/' + backendDir.trim());

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

exports.pathResolve = function (relPath, normalize) {
  if (normalize) {
    return path.normalize(`${global.workDir}/${relPath}`);
  }
  else {
    return `${global.workDir}/${relPath}`;
  }
};

exports.upsearch = function (fileName, workDirParam) {
  var dirMatch;
  var workDir = path.normalize(`${workDirParam}/..`);
  var files = fs.readdirSync(workDir);

  if (files.indexOf(fileName) > -1) {
    return workDir;
  }
  else if (workDir !== '/') {
    dirMatch = upsearch(fileName, workDir);
  }

  return dirMatch;
};

// ///////////////////////////////////////////////////////////////////////////
// Logging.
// ///////////////////////////////////////////////////////////////////////////
exports.console = console;

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

exports.i = function (obj, showHidden, depth) {
  depth = depth ? depth : null;
  return util.inspect(obj, showHidden, depth);
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
    fs.copySync(exports.pathResolve('backend/' + webservedDirsFull[i]), staticDir + '/' + webservedDirsShort[i]);
  }
};
