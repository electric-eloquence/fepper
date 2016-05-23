'use strict';

module.exports = class {
  static express() {
    var fpExpress = require('./fp-express');
    var app = fpExpress.main();

    return app;
  }
};
