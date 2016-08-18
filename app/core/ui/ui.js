'use strict';

const fs = require('fs-extra');
const path = require('path');

const utils = require('../lib/utils');

var conf = global.conf;
var pubDir = conf.ui.paths.public;
var srcDir = conf.ui.paths.source;

module.exports = class {
  build(arg) {
    var indexFile;
    var indexFileOut;
    var patternlab = require(utils.pathResolve(conf.ui.paths.core.lib + '/patternlab.js'))(conf.ui);

    if (typeof arg === 'undefined') {
      patternlab.build(function () {});

      // Some overrides after the stock build.
      indexFile = utils.pathResolve(pubDir.root + '/index.html');
      indexFileOut = fs.readFileSync(indexFile, conf.enc);
      indexFileOut = indexFileOut.replace(/(allow-same-origin allow-scripts)/, '$1 allow-forms allow-popups');
      indexFileOut = indexFileOut.replace(/(<\/body>)/, '    <script src="_scripts/src/variables.styl" type="text/javascript"></script>\n$1');
      indexFileOut = indexFileOut.replace(/(<\/body>)/, '    <script src="_scripts/src/fepper-obj.js"></script>\n$1');
      indexFileOut = indexFileOut.replace(/(<\/body>)/, '    <script src="_scripts/patternlab-overrider.js"></script>\n$1');
      fs.writeFileSync(indexFile, indexFileOut);
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
    fs.copySync(utils.pathResolve(srcDir.root + '/static'), utils.pathResolve(pubDir.root + '/static'));
  }

  copyStyles() {
    fs.copySync(utils.pathResolve(srcDir.css), utils.pathResolve(pubDir.css));
  }
};
