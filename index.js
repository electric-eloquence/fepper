#!/usr/bin/env node
'use strict';

var cp = require('child_process');

// Set global.conf and process.env.CONF.
var utils = require('./core/lib/utils');
utils.conf();

var argv = ['--gulpfile', 'tasker.js'];
var i;
var j = 3;
var quoted = false;

// Set up array of args for submission to Gulp.
argv[2] = process.argv[2] ? process.argv[2] : 'default';

// Args containing spaces are wrapped in double quotes by the fp bash script.
// Now, parse the process.argv array for those wrapped args, and create a new
// array where they are formatted correctly.
if (process.argv[3]) {
  for (i = 3; i < process.argv.length; i++) {
    if (quoted) {
      argv[j] += ` ${process.argv[i]}`;
    }
    else {
      argv[j] = process.argv[i];
    }

    if (argv[j][0] === '"') {
      quoted = true;
    }
    else if (argv[j].slice(-1) === '"') {
      quoted = false;
    }

    if (!quoted) {
      j++;
    }
  }
}

cp.spawn('./node_modules/.bin/gulp', argv, {stdio: 'inherit'});
