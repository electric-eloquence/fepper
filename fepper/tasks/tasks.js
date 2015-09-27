(function () {
  'use strict';

  var utils = require('../lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();

  module.exports = class {
    static appendix() {
      require('./appendixer.js').main(conf.src);
    }

    static ghPagesPrefix() {
      require('./gh-pages-prefixer.js').main();
    }

    static jsonCompile() {
      require('./json-compiler.js').main(conf.src);
    }

    static patternOverride() {
      require('./pattern-overrider.js').main(rootDir + '/' + conf.pub + '/js/pattern-overrider.js');
    }

    static staticGenerate() {
      require('./static-generator.js').main();
    }

    static template() {
      require('./templater.js').main();
    }
  };
})();
