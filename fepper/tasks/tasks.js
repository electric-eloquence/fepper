(function () {
  'use strict';

  module.exports = class {
    static appendix() {
      require('./appendixer.js').main();
    }

    static ghPagesPrefix() {
      require('./gh-pages-prefixer.js').main();
    }

    static jsonCompile() {
      require('./json-compiler.js').main();
    }

    static patternOverride() {
      require('./pattern-overrider.js').main();
    }

    static staticGenerate() {
      require('./static-generator.js').main();
    }

    static template() {
      require('./templater.js').main();
    }
  }
})();
