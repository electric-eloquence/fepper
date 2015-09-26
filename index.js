#!/usr/bin/env node
(function () {
  'use strict';

  var cp = require('child_process');

  var argv2 = process.argv[2] ? process.argv[2] : 'default';

  cp.spawn('./node_modules/.bin/gulp', [argv2], {stdio:'inherit'});
})();
