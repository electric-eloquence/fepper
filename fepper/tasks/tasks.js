(function () {
  'use strict';

  var utils = require('../lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();

  module.exports = class {
    static appendix(srcDir) {
      require('./appendixer.js').main(srcDir);
    }

    static ghPagesPrefix() {
      require('./gh-pages-prefixer.js').main();
    }

    static jsonCompile(srcDir) {
      require('./json-compiler.js').main(srcDir);
    }

    static patternOverride(dest) {
      require('./pattern-overrider.js').main(dest);
    }

    static staticGenerate() {
      require('./static-generator.js').main();
    }

    static template() {
      require('./templater.js').main();
    }
  };
})();
