'use strict';

const cp = require('child_process');
const path = require('path');

var argv = ['--gulpfile', 'app/tasker.js'];

// Set up array of args for submission to Gulp.
argv[2] = process.argv[2] ? process.argv[2] : 'default';

// Args containing spaces are wrapped in double quotes by the fp bash script.
// Now, parse the process.argv array for those wrapped args, and create a new
// array where they are formatted correctly.
if (process.argv[3]) {
  let j = 3;
  let quoted = false;

  for (let i = 3; i < process.argv.length; i++) {
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

cp.spawn(path.resolve('node_modules', '.bin', 'gulp'), argv, {stdio: 'inherit'});
