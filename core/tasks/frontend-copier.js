/**
 * Compiles templates in Pattern Lab to templates in backend.
 *
 * Converts Mustache tags into whatever type of tokens are used by the backend
 * webapp based on mappings in a YAML file named similarly to the Mustache
 * template.
 */
'use strict';

var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var yaml = require('js-yaml');

var utils = require('../lib/utils');

exports.targetDirCheck = function (workDir, dir) {
  var fullPath;
  var stats;

  if (typeof dir === 'string') {
    fullPath = workDir + '/backend/' + dir.trim();
    stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      return fullPath;
    }
  }

  return '';
};

exports.targetDirGlob = function (srcDir) {
  var glob1 = glob.sync(srcDir + '/!(__)*!(.yml)');
  var glob2 = glob.sync(srcDir + '/!(_no_sync)/!(__)*!(.yml)');
  return glob1.concat(glob2);
};

exports.main = function (workDir, conf, pref) {
  var data;
  var files;
  var i;
  var j;
  var srcDir = workDir + '/' + conf.src;
  var stats;
  var syncTypeAppended;
  var syncTypes = ['assets', 'scripts', 'styles'];
  var targetDir;
  var targetDirDefault;
  var yml;
  var ymlFile = '';

  for (i = 0; i < syncTypes.length; i++) {
    try {
      syncTypeAppended = syncTypes[i] + '_dir';
      targetDirDefault = exports.targetDirCheck(workDir, pref.backend.synced_dirs[syncTypeAppended]);

      // Search source directory for frontend files.
      // Excluding files in _nosync directory and those prefixed by __.
      // Trying to keep the globbing simple and maintainable.
      files = exports.targetDirGlob(srcDir + '/' + syncTypes[i]);
      for (j = 0; j < files.length; j++) {
        stats = null;
        targetDir = '';

        // Read YAML file and store keys/values in tokens object.
        ymlFile = files[j].replace(/\.[a-z]+$/, '.yml');
        // Make sure the YAML file exists before proceeding.
        try {
          stats = fs.statSync(ymlFile);
        }
        catch (err) {
          // Unset ymlFile if no YAML file.
          ymlFile = '';
        }

        if (stats && stats.isFile()) {
          try {
            yml = fs.readFileSync(ymlFile, conf.enc);
            data = yaml.safeLoad(yml);

            if (typeof data[syncTypeAppended] === 'string') {
              targetDir = exports.targetDirCheck(workDir, data[syncTypeAppended]);
              // Unset templates_dir in local YAML data.
              delete data[syncTypeAppended];
            }
          }
          catch (err) {
            // Fail gracefully.
          }
        }

        if (targetDirDefault && !targetDir) {
          targetDir = targetDirDefault;
        }

        if (targetDir) {
          // Copy to targetDir.
          fs.copySync(files[j], targetDir + '/' + path.basename(files[j]));
        }
      }
    }
    catch (err) {
      utils.error(err);
    }
  }
};
