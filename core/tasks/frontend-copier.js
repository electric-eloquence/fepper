'use strict';

var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var yaml = require('js-yaml');

var utils = require('../lib/utils');

exports.srcDirGlob = function (srcDir) {
  var globbed = glob.sync(srcDir + '/*');
  var globbed1 = glob.sync(srcDir + '/!(_nosync)/**');
  return globbed.concat(globbed1);
};

exports.main = function (workDir, conf, pref, frontendType) {
  var data;
  var files;
  var frontendDataKey = frontendType + '_dir';
  var frontendGlob = frontendType;
  var i;
  var scriptsTarget;
  var srcDir = workDir + '/' + conf.src;
  var srcDir1;
  var stats;
  var stats1;
  var targetDir;
  var targetDirDefault;
  var yml;
  var ymlFile = '';

  try {
    frontendGlob += frontendType === 'scripts' ? '/*' : '';
    targetDirDefault = utils.backendDirCheck(workDir, pref.backend.synced_dirs[frontendDataKey]);

    // Search source directory for frontend files.
    // Trying to keep the globbing simple and maintainable.
    files = exports.srcDirGlob(srcDir + '/' + frontendGlob);
    for (i = 0; i < files.length; i++) {
      try {
        stats = fs.statSync(files[i]);
      }
      catch (err) {
        // Fail gracefully.
      }

      // Exclude directories and files prefixed by __ or suffixed by .yml.
      if (
        !stats ||
        !stats.isFile() ||
        path.basename(files[i]).slice(0, 2) === '__' ||
        files[i].slice(-4) === '.yml'
      ) {
        continue;
      }

      srcDir1 = srcDir;
      stats1 = null;
      targetDir = '';

      // Read YAML file and store keys/values in tokens object.
      ymlFile = files[i].replace(/\.[a-z]+$/, '.yml');

      // If iterating on minified script, check for its source file's YAML.
      if (frontendType === 'scripts' && files[i].indexOf(srcDir1 + '/scripts/min/') === 0) {
        ymlFile = ymlFile.replace(srcDir1 + '/scripts/min/', srcDir1 + '/scripts/src/');
      }

      // Make sure the YAML file exists before proceeding.
      try {
        stats1 = fs.statSync(ymlFile);
      }
      catch (err) {
        // Unset ymlFile if no YAML file.
        ymlFile = '';
      }

      if (stats1 && stats1.isFile()) {
        try {
          yml = fs.readFileSync(ymlFile, conf.enc);
          data = yaml.safeLoad(yml);

          if (typeof data[frontendDataKey] === 'string') {
            targetDir = utils.backendDirCheck(workDir, data[frontendDataKey]);
            // Do not maintain nested directory structure in backend if
            // frontendDataKey is set in exceptional YAML file.
            if (targetDir) {
              srcDir1 = path.dirname(files[i]);
            }
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
        // If copying to default target, retain nested directory structure.
        if (targetDir === targetDirDefault) {
          // If copying scripts, do not segregate min from src.
          if (frontendType === 'scripts') {
            scriptsTarget = files[i].replace(srcDir1 + '/' + frontendType + '/min', '');
            scriptsTarget = scriptsTarget.replace(srcDir1 + '/' + frontendType + '/src', '');
            fs.copySync(files[i], targetDir + '/' + scriptsTarget);
          }
          else {
            fs.copySync(files[i], targetDir + '/' + files[i].replace(srcDir1 + '/' + frontendType + '/', ''));
          }
        }
        else {
          fs.copySync(files[i], targetDir + '/' + path.basename(files[i]));
        }
      }
    }
  }
  catch (err) {
    utils.error(err);
  }
};
