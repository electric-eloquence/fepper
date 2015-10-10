(function () {
  'use strict';

  var utilsFepper = require('../../fepper/lib/utils');

  exports.handleError = function (err) {
    utilsFepper.log(err.toString());
    this.emit('end');
  };
})();
