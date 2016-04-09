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

    jsonCompile() {
      require('./json-compiler.js').main(this.workDir, this.conf);
    }

    open() {
      require('./opener.js').main(this.workDir, this.conf);
    }

    patternOverride() {
      require('./pattern-overrider.js').main(this.workDir, this.conf);
    }

    publish(conf, publishDir, test) {
      require('./publisher.js').main(this.workDir, conf, publishDir, test);
    }

    staticGenerate() {
      require('./static-generator.js').main(this.workDir, this.conf);
    }

    template(destDir, ext) {
      require('./templater.js').main(this.workDir, this.conf, destDir, ext);
    }
  };
})();
