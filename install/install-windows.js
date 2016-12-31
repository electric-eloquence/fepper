'use strict';

const exec = require('child_process').exec;
const fs = require('fs-extra');
const path = require('path');

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

  var srcDir = 'node_modules/fepper/excludes/profiles/windows';

  windowsFiles.forEach(function (windowsFile) {
    fs.copySync(path.resolve(srcDir, windowsFile), windowsFile);
  });
});
