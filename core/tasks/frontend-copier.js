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

exports.srcDirGlob = function (srcDir) {
  var glob1 = glob.sync(srcDir + '/!(__)*!(.yml)');
  var glob2 = glob.sync(srcDir + '/!(_no_sync)/!(__)*!(.yml)');
  return glob1.concat(glob2);
};

exports.main = function (workDir, conf, pref, frontendGlob, frontendDataKey) {
  var data;
  var files;
  var i;
  var srcDir = workDir + '/' + conf.src;
  var stats;
  var targetDir;
  var targetDirDefault;
  var yml;
  var ymlFile = '';

  try {
    targetDirDefault = utils.backendDirCheck(workDir, pref.backend.synced_dirs[frontendDataKey]);

    // Search source directory for frontend files.
    // Excluding files in _nosync directory and those prefixed by __.
    // Trying to keep the globbing simple and maintainable.
    files = exports.srcDirGlob(srcDir + '/' + frontendGlob);
    for (i = 0; i < files.length; i++) {
      stats = null;
      targetDir = '';

      // Read YAML file and store keys/values in tokens object.
      ymlFile = files[i].replace(/\.[a-z]+$/, '.yml');
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

          if (typeof data[frontendDataKey] === 'string') {
            targetDir = utils.backendDirCheck(workDir, data[frontendDataKey]);
            // Unset templates_dir in local YAML data.
            delete data[frontendDataKey];
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
        fs.copySync(files[i], targetDir + '/' + path.basename(files[i]));
      }
    }
  }
  catch (err) {
    utils.error(err);
  }
};
