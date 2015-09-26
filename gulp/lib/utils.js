(function () {
  'use strict';

  var utilsFepper = require('../../fepper/lib/utils');

  exports.handleError = function (err) {
    utilsFepper.log(err.toString());
    this.emit('end');
  }

  exports.log = function (err, stdout, stderr) {
    stdout = stdout.trim();
    stderr = stderr.trim();
    if (stdout !== '') {
      utilsFepper.log(stdout);
    }
    if (stderr !== '') {
      utilsFepper.error(stderr);
    }
  };
})();
