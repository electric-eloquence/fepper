'use strict';

const conf = global.conf;
const pref = global.pref;

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const yaml = require('js-yaml');

const utils = require('../lib/utils');

const sourceDir = utils.pathResolve(conf.ui.paths.source.root, true);

const scriptsDirBld = utils.pathResolve(conf.ui.paths.source.jsBld);
const scriptsDirSrc = utils.pathResolve(conf.ui.paths.source.jsSrc);

exports.mapPlNomenclature = function (frontendType) {
  var plName = frontendType;

  switch (frontendType) {
    case 'assets':
      plName = 'images';
      break;
    case 'scripts':
      plName = 'js';
      break;
    case 'styles':
      plName = 'css';
  }

  return plName;
};

exports.srcDirGlob = function (frontendType) {
  var globDir;
  var globDir1;
  var plName = exports.mapPlNomenclature(frontendType);
  var srcDir = utils.pathResolve(conf.ui.paths.source[plName]);

  switch (frontendType) {
    case 'assets':
      globDir = srcDir + '/*';
      globDir1 = srcDir + '/!(_nosync)/**';
      break;
    case 'scripts':
      globDir = srcDir + '/*/*';
      globDir1 = srcDir + '/*/!(_nosync)/**';
      break;
    case 'styles':
      globDir = srcDir + '/*';
      globDir1 = srcDir + '/!(_nosync)/**';
  }

  var globbed = glob.sync(globDir);
  var globbed1 = glob.sync(globDir1);

  return globbed.concat(globbed1);
};

exports.main = function (frontendType) {
  var data;
  var files;
  var frontendDataKey = `${frontendType}_dir`;
  var frontendDir = `_${frontendType}`;
  var i;
  var srcDir;
  var stats;
  var stats1;
  var targetDir;
  var targetDirDefault;
  var yml;
  var ymlFile = '';

  try {
    targetDirDefault = utils.backendDirCheck(pref.backend.synced_dirs[frontendDataKey]);

    // Search source directory for frontend files.
    // Trying to keep the globbing simple and maintainable.
    files = exports.srcDirGlob(frontendType);
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

      srcDir = sourceDir;
      stats1 = null;
      targetDir = '';

      // Check for file-specific YAML file.
      ymlFile = files[i].replace(/\.[a-z]+$/, '.yml');

      // If iterating on a built script, check for its source file's YAML.
      if (frontendType === 'scripts' && files[i].indexOf(scriptsDirBld) === 0) {
        ymlFile = ymlFile.replace(scriptsDirBld, scriptsDirSrc);
      }

      // Read and process YAML file if it exists.
      try {
        stats1 = fs.statSync(ymlFile);
      }
      catch (err) {
        // Fail gracefully.
      }

      if (stats1 && stats1.isFile()) {
        try {
          yml = fs.readFileSync(ymlFile, conf.enc);
          data = yaml.safeLoad(yml);

          if (typeof data[frontendDataKey] === 'string') {
            targetDir = utils.backendDirCheck(data[frontendDataKey]);
            // Do not maintain nested directory structure in backend if
            // frontendDataKey is set in exceptional YAML file.
            if (targetDir) {
              srcDir = path.dirname(files[i]);
            }
            // Unset templates_dir in local YAML data.
            delete data[frontendDataKey];
          }
        }
        catch (err) {
          // Fail gracefully.
        }
      }
      else {
        srcDir += `/${frontendDir}`;
      }

      if (targetDirDefault && !targetDir) {
        targetDir = targetDirDefault;
      }

      if (targetDir) {
        // Copy to targetDir.
        // If copying to default target, retain nested directory structure.
        if (targetDir === targetDirDefault) {
          fs.copySync(files[i], targetDir + '/' + files[i].replace(srcDir, ''));
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
