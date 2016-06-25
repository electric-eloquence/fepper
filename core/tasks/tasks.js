'use strict';

module.exports = class {
  constructor(workDir, conf, pref) {
    this.workDir = workDir;
    this.conf = conf;
    this.pref = pref || {};
  }

  appendix() {
    require('./appendixer').main(this.workDir, this.conf);
  }

  frontendCopy(frontendType) {
    require('./frontend-copier').main(this.workDir, this.conf, this.pref, frontendType);
  }

  jsonCompile() {
    require('./json-compiler').main(this.workDir, this.conf);
  }

  open() {
    require('./opener').main(this.workDir, this.conf);
  }

  patternOverride() {
    require('./pattern-overrider').main(this.workDir, this.conf);
  }

  publish(publicDir, publishDir, test) {
    require('./publisher').main(this.workDir, publicDir, publishDir, this.conf, this.pref, test);
  }

  staticGenerate() {
    require('./static-generator').main(this.workDir, this.conf, this.pref);
  }

  template() {
    require('./templater').main(this.workDir, this.conf, this.pref);
  }
};
