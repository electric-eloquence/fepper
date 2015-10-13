#!/usr/bin/env node
(function () {
  'use strict';

  var cp = require('child_process');

  var argv2 = process.argv[2] ? process.argv[2] : 'default';
  var utils = require('./core/lib/utils');
  // Set global.conf and process.env.CONF.
  utils.conf();

  cp.spawn('./node_modules/.bin/gulp', [argv2], {stdio: 'inherit'});
})();
