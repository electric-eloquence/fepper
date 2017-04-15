'use strict';

const exec = require('child_process').exec;
const path = require('path');

var binGulp = path.resolve('node_modules', '.bin', 'gulp');
exec(`${binGulp} --gulpfile node_modules/fepper/tasker.js update`, (err, stdout, stderr) => {
  if (err) {
    throw err;
  }

  /* eslint-disable no-console */
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
});
