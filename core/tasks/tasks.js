'use strict';

module.exports = class {
  constructor(workDir, conf, pref) {
    this.workDir = workDir;
    this.conf = conf;
    this.pref = pref || {};
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

  publish(publishDir, pref, test) {
    require('./publisher.js').main(this.workDir, publishDir, this.conf, pref, test);
  }

  staticGenerate() {
    require('./static-generator.js').main(this.workDir, this.conf, this.pref);
  }

  template() {
    require('./templater.js').main(this.workDir, this.conf, this.pref);
  }
};
