'use strict';

var fs = require('fs-extra');
var path = require('path');

module.exports = class {
  constructor(workDir, conf) {
    this.workDir = workDir;
    this.plnDir = path.normalize(workDir + '/' + conf.pln);
    this.conf = conf;
  }

  build(arg) {
    var indexFile;
    var indexFileOut;
    var patternlab = require(this.plnDir + '/core/lib/patternlab.js')();

    if (typeof arg === 'undefined') {
      patternlab.build();

      // Some overrides after the stock build.
      indexFile = this.plnDir + '/public/index.html';
      indexFileOut = fs.readFileSync(indexFile, this.conf.enc);
      indexFileOut = indexFileOut.replace(/(allow-same-origin allow-scripts)/, '$1 allow-forms allow-popups');
      indexFileOut = indexFileOut.replace(/(<\/body>)/, '    <script src="scripts/src/variables.styl" type="text/javascript"></script>\n$1');
      indexFileOut = indexFileOut.replace(/(<\/body>)/, '    <script src="scripts/src/fepper-obj.js"></script>\n$1');
      indexFileOut = indexFileOut.replace(/(<\/body>)/, '    <script src="scripts/patternlab-overrider.js"></script>\n$1');
      fs.writeFileSync(indexFile, indexFileOut);
    }
    else if (arg === 'v') {
      patternlab.version();
    }
    else if (arg === 'only-patterns') {
      patternlab.build_patterns_only();
    }
    else if (arg === 'help') {
      patternlab.help();
    }
    else {
      patternlab.help();
    }
  }

  clean() {
    fs.removeSync(this.plnDir + '/public/patterns');
  }

  copy() {
    fs.copySync(this.plnDir + '/source/_data/annotations.js', this.plnDir + '/public/data/annotations.js');
    fs.copySync(this.plnDir + '/source/assets', this.plnDir + '/public/assets');
    fs.copySync(this.plnDir + '/source/scripts', this.plnDir + '/public/scripts');
    fs.copySync(this.plnDir + '/source/static', this.plnDir + '/public/static/');
  }

  copyStyles() {
    fs.copySync(this.plnDir + '/source/styles', this.plnDir + '/public/styles');
  }
};
