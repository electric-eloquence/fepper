(function () {
  'use strict';

  module.exports = class {
    static express() {
      var express = require('./express');
      var app = express.main();

      return app;
    }
  };
})();
