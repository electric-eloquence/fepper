(function () {
  'use strict';

  var fs = require('fs-extra');
  var path = require('path');
  var util = require('util');
  var yaml = require('js-yaml');

  var enc = 'utf8';

  // ///////////////////////////////////////////////////////////////////////////
  // Conf and global vars.
  // ///////////////////////////////////////////////////////////////////////////
  exports.conf = function () {
    var conf;
    var defaults;
    var yml;

    try {
      yml = fs.readFileSync(__dirname + '/../../default.conf.yml', enc);
      defaults = yaml.safeLoad(yml);
    }
    catch (err) {
      exports.error('Missing or malformed defaults.conf.yml! Exiting!');
      return;
    }

    defaults.gh_pages_src = null;
    defaults.gh_pages_dest = null;

    if (!global.conf) {
      // Try getting conf from global process object.
      if (typeof process.env.CONF === 'string') {
        try {
          conf = JSON.parse(process.env.CONF);
          conf = exports.mergeObjects(defaults, conf);
        }
        catch (err) {
          // Fail gracefully.
        }
      }

      if (!conf) {
        try {
          yml = fs.readFileSync(__dirname + '/../../conf.yml', enc);
          conf = yaml.safeLoad(yml);
        }
        catch (err) {
          exports.error('Missing or malformed conf.yml! Exiting!');
          return;
        }

        conf = exports.mergeObjects(defaults, conf);
        process.env.CONF = JSON.stringify(conf);
      }

      global.conf = conf;
    }

    return global.conf;
  };

  exports.data = function (workDir, conf) {
    return fs.readJsonSync(workDir + '/' + conf.src + '/_data/data.json', {throws: false});
  };

  exports.rootDir = function () {
    return path.normalize(__dirname + '/../..');
  };

  // ///////////////////////////////////////////////////////////////////////////
  // Data utilities.
  // ///////////////////////////////////////////////////////////////////////////
  /**
   * Recursively merge properties of two objects.
   *
   * @param {Object} obj1 If obj1 has properties obj2 doesn't, add to obj2.
   * @param {Object} obj2 This object's properties have priority over obj1.
   * @returns {Object} obj2
   */
  exports.mergeObjects = function (obj1, obj2) {
    if (typeof obj2 === 'undefined') {
      obj2 = {};
    }

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
  // Logging.
  // ///////////////////////////////////////////////////////////////////////////
  exports.console = console;

  exports.isTest = function () {
    var isGulp = false;
    var isTest = false;

    for (var i = 0; i < process.argv.length; i++) {
      if (process.argv[i].substr(-5) === 'mocha') {
        isTest = true;
        break;
      }
      else if (process.argv[i].substr(-4) === 'gulp') {
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
   * @param The {array} webservedDirsFull The array of webserved directories.
   * @return {array} The webserved directories stripped of configuration prefix.
   */
  exports.webservedDirnamesTruncate = function (webservedDirsFull) {
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
   * Copy webserved_dirs to gh_pages_src.
   */
  exports.webservedDirsCopy = function (webservedDirsFull, rootDir, webservedDirsShort, ghPagesDir) {
    var i;

    for (i = 0; i < webservedDirsFull.length; i++) {
      fs.copySync(rootDir + '/backend/' + webservedDirsFull[i], ghPagesDir + '/' + webservedDirsShort[i]);
    }
  };
})();
