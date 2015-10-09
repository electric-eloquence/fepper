(function () {
  'use strict';

  var fs = require('fs-extra');
  var path = require('path');

  module.exports = class {
    constructor(workDir, conf) {
      this.workDir = workDir;
      this.plDir = path.normalize(workDir + '/' + conf.pln);
      this.conf = conf;
    }

    build(arg) {
      var patternlab_engine = require(this.plDir + '/builder/patternlab.js');
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
      return function () {
        fs.removeSync('./public/patterns');
      };
    }

    copy() {
      return function () {
        fs.copySync('./source/_data/annotations.js', './public/data/annotations.js');
        fs.copySync('./source/css', './public/css');
        fs.copySync('./source/fonts', './public/fonts');
        fs.copySync('./source/images', './public/images');
        fs.copySync('./source/js', './public/js');
        fs.copySync('./source/static', './public/static/');
      };
    }

    copyCss() {
      return function () {
        fs.copySync('./source/css', './public/css');
      };
    }
  };
})();
