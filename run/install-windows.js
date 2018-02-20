/* eslint-disable no-console */
'use strict';

const spawnSync = require('child_process').spawnSync;
const fs = require('fs');
const path = require('path');

// Only run npm install if not already installed.
if (!fs.existsSync('node_modules')) {
  let binNpm = 'npm';

  // Spawn npm.cmd if Windows and not BASH.
  if (process.env.ComSpec && process.env.ComSpec.toLowerCase() === 'c:\\windows\\system32\\cmd.exe') {
    binNpm = 'npm.cmd';
  }

  spawnSync(binNpm, ['install'], {stdio: 'inherit'});
}

// Then, copy over Windows-specific files.
const windowsFiles = [
  'fepper.ps1',
  'fepper.vbs'
];

const srcDir = path.resolve('node_modules', 'fepper', 'excludes', 'profiles', 'windows');

windowsFiles.forEach(function (windowsFile) {
  fs.copyFileSync(path.resolve(srcDir, windowsFile), windowsFile);
});
