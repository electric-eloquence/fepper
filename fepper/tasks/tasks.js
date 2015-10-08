(function () {
  'use strict';

  module.exports = class {
    constructor(conf, rootPath, pubPath) {
      this.conf = conf;
      this.rootPath = rootPath;
    }

    appendix(srcDir) {
      require('./appendixer.js').main(srcDir);
    }

    ghPagesPrefix() {
      require('./gh-pages-prefixer.js').main(this.conf, this.rootPath, this.conf.pub);
    }

    jsonCompile(srcDir) {
      require('./json-compiler.js').main(srcDir);
    }

    patternOverride(dest) {
      require('./pattern-overrider.js').main(dest);
    }

    staticGenerate() {
      require('./static-generator.js').main(this.rootPath);
    }

    template() {
      require('./templater.js').main(this.rootPath);
    }
  };
})();
