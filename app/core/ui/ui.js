'use strict';

const fs = require('fs-extra');

const utils = require('../lib/utils');

const conf = global.conf;
const pubDir = conf.ui.paths.public;
const srcDir = conf.ui.paths.source;
const workDir = global.workDir;

const patternlab = require(utils.pathResolve(`${conf.ui.paths.core.lib}/patternlab.js`))(conf.ui, workDir);

module.exports = class {
  build(arg) {
    if (typeof arg === 'undefined') {
      patternlab.build(function () {});
    }
    else if (arg === 'v') {
      patternlab.version();
    }
    else if (arg === 'patternsonly') {
      patternlab.patternsonly(function () {}, conf.ui.cleanPublic);
    }
    else if (arg === 'help') {
      patternlab.help();
    }
    else {
      patternlab.help();
    }
  }

  clean() {
    fs.removeSync(utils.pathResolve(pubDir.patterns));
  }

  copy() {
    fs.copySync(utils.pathResolve(srcDir.images), utils.pathResolve(pubDir.images));
    fs.copySync(utils.pathResolve(srcDir.js), utils.pathResolve(pubDir.js));
    fs.copySync(utils.pathResolve(srcDir.static), utils.pathResolve(pubDir.static));
  }

  copyStyles() {
    fs.copySync(utils.pathResolve(srcDir.cssBld), utils.pathResolve(pubDir.css));
  }
};
