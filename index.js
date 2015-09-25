(function () {
  'use strict';

  var cp = require('child_process');

  var argv2 = process.argv[2] ? process.argv[2] : 'default';
  var utils = require('./fepper/lib/utils');

  cp.spawn('./node_modules/.bin/gulp', [argv2], {stdio:'inherit'})
    .on('exit', function (error) {
      utils.error(error);
    });
})();
