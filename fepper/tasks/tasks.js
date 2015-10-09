(function () {
  'use strict';

  module.exports = class {
    constructor(workDir, conf) {
      this.workDir = workDir;
      this.conf = conf;
    }

    appendix() {
      require('./appendixer.js').main(this.workDir, this.conf);
    }

    ghPagesPrefix() {
      require('./gh-pages-prefixer.js').main(this.workDir, this.conf);
    }

    jsonCompile() {
      require('./json-compiler.js').main(this.workDir, this.conf);
    }

    patternOverride() {
      require('./pattern-overrider.js').main(this.workDir, this.conf);
    }

    staticGenerate() {
      require('./static-generator.js').main(this.workDir, this.conf);
    }

    template() {
      require('./templater.js').main(this.workDir, this.conf);
    }
  };
})();
