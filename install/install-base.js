'use strict';

const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const sourceDir = 'source';

new Promise(function (resolve) {
  // First, create empty source dir so the postinstall script doesn't write the main profile there.
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir);
  }

  // Then, run npm install.
  exec('npm install', (err, stdout, stderr) => {
    if (err) {
      throw err;
    }

    if (stderr) {

      /* eslint-disable no-console */
      console.log(stderr);
    }
    console.log(stdout);

    /* eslint-enable no-console */
    resolve();
  });
})
.then(function () {
  // Then, delete the empty source dir so a new one can be copied over.
  fs.rmdirSync(sourceDir);

  // Then, copy over the base profile source dir.
  var binGulp = path.resolve('node_modules', '.bin', 'gulp');
  exec(`${binGulp} --gulpfile node_modules/fepper/tasker.js install-base`, (err, stdout, stderr) => {
    if (err) {
      throw err;
    }

    fs.writeFileSync('install.log', stdout);
    if (stderr) {

      /* eslint-disable no-console */
      console.log(stderr);

      /* eslint-enable no-console */
      fs.appendFileSync('install.log', stderr);
    }
  });
});
