/**
 * This gulpfile is only for debugging task called by the Fepper class defined
 * in tasks.js. These tasks require that the process.cwd() be this directory.
 */
(function () {
  'use strict';

  var requireDir = require('require-dir');

  var utils = require('../lib/utils');
  // Set global.conf and process.env.CONF.
  utils.conf();

  // Load tasks in tasks directory.
  requireDir('../../gulp', {recurse: true});
})();
