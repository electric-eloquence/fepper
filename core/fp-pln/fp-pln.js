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
      var patternlab_engine = require(this.plnDir + '/builder/patternlab.js');
      var patternlab = patternlab_engine();

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
      fs.copySync(this.plnDir + '/source/css', this.plnDir + '/public/css');
      fs.copySync(this.plnDir + '/source/fonts', this.plnDir + '/public/fonts');
      fs.copySync(this.plnDir + '/source/images', this.plnDir + '/public/images');
      fs.copySync(this.plnDir + '/source/js', this.plnDir + '/public/js');
      fs.copySync(this.plnDir + '/source/static', this.plnDir + '/public/static/');
    }

    copyCss() {
      fs.copySync(this.plnDir + '/source/css', this.plnDir + '/public/css');
    }
  };
})();
