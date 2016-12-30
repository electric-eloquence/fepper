'use strict';

const exec = require('child_process').exec;

const copy = require('./copy');

const excludesDir = 'app/excludes/profiles/windows';

new Promise(function (resolve) {
  // Run npm install.
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
  // Then, copy over Windows-specific files.
  var windowsFiles = [
    'fepper.ps1',
    'fepper.vbs'
  ];

  windowsFiles.forEach(function (windowsFile) {
    copy.file(windowsFile, excludesDir, function () {});
  });
});
