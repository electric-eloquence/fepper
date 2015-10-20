(function () {
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
      var patternlab = require(this.plnDir + '/builder/patternlab.js')();

      if (typeof arg === 'undefined') {
        patternlab.build();
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
})();
