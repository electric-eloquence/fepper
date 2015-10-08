(function () {
  'use strict';

  module.exports = class {
    constructor(plPath) {
      this.plPath = plPath;
    }

    appendix(srcDir) {
      require('./appendixer.js').main(srcDir);
    }

    ghPagesPrefix() {
      require('./gh-pages-prefixer.js').main(this.plPath);
    }

    jsonCompile(srcDir) {
      require('./json-compiler.js').main(srcDir);
    }

    patternOverride(dest) {
      require('./pattern-overrider.js').main(dest);
    }

    staticGenerate() {
      require('./static-generator.js').main(this.plPath);
    }

    template() {
      require('./templater.js').main(this.plPath);
    }
  };
})();
