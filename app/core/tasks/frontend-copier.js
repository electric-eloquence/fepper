'use strict';

const conf = global.conf;
const pref = global.pref;

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const yaml = require('js-yaml');

const utils = require('../lib/utils');

const sourceDir = utils.pathResolve(conf.ui.paths.source.root);

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
  var srcDirBld = utils.pathResolve(conf.ui.paths.source[`${plName}Bld`]);

  switch (frontendType) {
    case 'assets':
      globDir = srcDir + '/*.*';
      globDir1 = srcDir + '/!(_nosync)/**';
      break;
    case 'scripts':
      globDir = srcDir + '/*/*.*';
      globDir1 = srcDir + '/*/!(_nosync)/**';
      break;
    case 'styles':
      globDir = srcDirBld + '/*.*';
      globDir1 = srcDirBld + '/!(_nosync)/**';
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
  var regexExt = /\.[a-z]+$/;
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

      // Exclude directories, files prefixed by __ or suffixed by .yml, and readme files.
      if (
        !stats ||
        !stats.isFile() ||
        path.basename(files[i]).slice(0, 2) === '__' ||
        files[i].slice(-4) === '.yml' ||
        path.basename(files[i]).replace(regexExt, '') === 'README'
      ) {
        continue;
      }

      srcDir = sourceDir;
      stats1 = null;
      targetDir = '';

      // Check for file-specific YAML file.
      if (regexExt.test(files[i])) {
        ymlFile = files[i].replace(regexExt, '.yml');
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
