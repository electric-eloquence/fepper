'use strict';

var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var yaml = require('js-yaml');

var utils = require('../lib/utils');

exports.srcDirGlob = function (srcDir) {
  var glob1 = glob.sync(srcDir + '/*');
  var glob2 = glob.sync(srcDir + '/!(_nosync)/**');
  return glob1.concat(glob2);
};

exports.main = function (workDir, conf, pref, frontendType) {
  var data;
  var files;
  var frontendDataKey = frontendType + '_dir';
  var frontendGlob = frontendType;
  var i;
  var scriptsTarget;
  var srcDir = workDir + '/' + conf.src;
  var stats1;
  var stats2;
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
        stats1 = fs.statSync(files[i]);
      }
      catch (err) {
        // Fail gracefully.
      }

      // Exclude directories and files prefixed by __ or suffixed by .yml.
      if (
        !stats1 ||
        !stats1.isFile() ||
        path.basename(files[i]).substring(0, 2) === '__' ||
        files[i].slice(-4) === '.yml'
      ) {
        continue;
      }

      stats2 = null;
      targetDir = '';

      // Read YAML file and store keys/values in tokens object.
      ymlFile = files[i].replace(/\.[a-z]+$/, '.yml');

      // If iterating on minified script, check for its source file's YAML.
      if (frontendType === 'scripts' && files[i].indexOf(srcDir + '/scripts/min/') === 0) {
        ymlFile = ymlFile.replace(srcDir + '/scripts/min/', srcDir + '/scripts/src/');
      }

      // Make sure the YAML file exists before proceeding.
      try {
        stats2 = fs.statSync(ymlFile);
      }
      catch (err) {
        // Unset ymlFile if no YAML file.
        ymlFile = '';
      }

      if (stats2 && stats2.isFile()) {
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
        // If copying to default target, retain nested directory structure.
        if (targetDir === targetDirDefault) {
          // If copying scripts, do not segregate min from src.
          if (frontendType === 'scripts') {
            scriptsTarget = files[i].replace(srcDir + '/' + frontendType + '/min', '');
            scriptsTarget = scriptsTarget.replace(srcDir + '/' + frontendType + '/src', '');
            fs.copySync(files[i], targetDir + '/' + scriptsTarget);
          }
          else {
            fs.copySync(files[i], targetDir + '/' + files[i].replace(srcDir + '/' + frontendType + '/', ''));
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
