(function () {
  'use strict';

  var fs = require('fs-extra');

  var Tasks = require('../tasks/tasks');
  var utils = require('../lib/utils');

  module.exports = class {
    constructor(plPath) {
      this.plPath = plPath;
    }

    build(arg) {
      var patternlab_engine = require(this.plPath + '/builder/patternlab.js');
      var patternlab = patternlab_engine();

      if (typeof arg === 'undefined') {
        return patternlab.build;
      }
      else if (arg === 'v') {
        return patternlab.version;
      }
      else if (arg === 'only-patterns') {
        return patternlab.build_patterns_only;
      }
      else if (arg === 'help') {
        return patternlab.help;
      }
      else {
        return patternlab.help;
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

    data() {
      var tasks = new Tasks(this.plPath);

      return [tasks.appendix, tasks.jsonCompile];
    }
  };
})();
