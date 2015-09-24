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

    if (!global.conf) {
      // Try getting conf from global process object.
      if (typeof process.env.CONF === 'string') {
        try {
          conf = JSON.parse(process.env.CONF);
        }
        catch (err) {
          // Fail gracefully.
        }
      }

      if (!conf) {
        yml = fs.readFileSync(__dirname + '/../../conf.yml', enc);
        conf = yaml.safeLoad(yml);
        process.env.CONF = JSON.stringify(conf);
      }

      global.conf = conf;
    }

    return global.conf || conf;
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
})();
