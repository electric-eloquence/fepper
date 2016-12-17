'use strict';

module.exports = class {
  appendix() {
    require('./appendixer').main();
  }

  frontendCopy(frontendType) {
    require('./frontend-copier').main(frontendType);
  }

  jsonCompile() {
    require('./json-compiler').main();
  }

  open() {
    require('./opener').main();
  }

  patternOverride() {
    require('./pattern-overrider').main();
  }

  staticGenerate() {
    require('./static-generator').main();
  }

  template() {
    require('./templater').main();
  }
};
