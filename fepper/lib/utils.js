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
    var yml;

    var defaults = {
      express_port: 3000,
      livereload_port: 35729,
      kill_zombies: true,
      timeout_main: 500,
      backend: {
        synced_dirs: {
          css_dir: null,
          fonts_dir: null,
          images_dir: null,
          js_dir: null,
          templates_dir: null,
          templates_ext: null
        },
        webserved_dirs: null
      },
      templater: {
        retain_mustache: false
      },
      enc: 'utf8',
      gh_pages_src: '.publish/fepper-gh-pages',
      gh_pages_dest: '.publish/gulp-gh-pages',
      pln: 'patternlab-node',
      bld: 'patternlab-node/builder',
      pub: 'patternlab-node/public',
      src: 'patternlab-node/source'
    };

    if (!global.conf) {
      // Try getting conf from global process object.
      if (typeof process.env.CONF === 'string') {
        try {
          conf = JSON.parse(process.env.CONF);
          conf = exports.mergeObjects(conf, defaults);
        }
        catch (err) {
          // Fail gracefully.
        }
      }

      if (!conf) {
        yml = fs.readFileSync(__dirname + '/../../conf.yml', enc);
        conf = yaml.safeLoad(yml);
        conf = exports.mergeObjects(conf, defaults);
        process.env.CONF = JSON.stringify(conf);
      }

      global.conf = conf;
    }

    return global.conf;
  };

  exports.data = function (conf) {
    return fs.readJsonSync(__dirname + '/../../' + conf.src + '/_data/data.json', {throws: false});
  };

  exports.rootDir = function () {
    return path.normalize(__dirname + '/../..');
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
            if (typeof obj2[i] === 'undefined') {
              obj2[i] = {};
            }
            obj2[i] = exports.mergeObjects(obj1[i], obj2[i]);
          // Pop when recursion meets a non-object. If obj1[i] is a non-object,
          // only copy to undefined obj2[i]. This way, obj2 maintains priority.
          }
          else if (typeof obj2[i] === 'undefined') {
            obj2[i] = obj1[i];
          }
        }
        catch (err) {
          // Property in destination object not set; create it and set its value.
          if (typeof obj2[i] === 'undefined') {
            obj2[i] = obj1[i];
          }
        }
      }
    }

    return obj2;
  };

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
