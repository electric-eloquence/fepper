(function () {
  'use strict';

  var utilsFepper = require('../../core/lib/utils');

  exports.handleError = function (err) {
    utilsFepper.log(err.toString());
    this.emit('end');
  };
})();
