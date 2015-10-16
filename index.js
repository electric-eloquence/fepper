#!/usr/bin/env node
(function () {
  'use strict';

  var cp = require('child_process');

  var utils = require('./core/lib/utils');

  // Set global.conf and process.env.CONF.
  utils.conf();
  // Set up array of args for submission to Gulp.
  process.argv[2] = process.argv[2] ? process.argv[2] : 'default';
  var argv = process.argv.splice(2);

  cp.spawn('./node_modules/.bin/gulp', argv, {stdio: 'inherit'});
})();
