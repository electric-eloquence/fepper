'use strict';

module.exports = class {
  static express() {
    const fpExpress = require('./fp-express');
    var app = fpExpress.main();

    return app;
  }
};
