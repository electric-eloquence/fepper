'use strict';

const cp = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const exec = cp.exec;
const spawnSync = cp.spawnSync;

const excludesDir = 'node_modules/fepper/excludes';

var confFile = 'conf.yml';
var confFileSrc = path.resolve(excludesDir, confFile);
if (!fs.existsSync(confFile)) {
  fs.copySync(confFileSrc, confFile);
}

var plConfFile = 'patternlab-config.json';
var plConfFileSrc = path.resolve(excludesDir, plConfFile);
if (!fs.existsSync(plConfFile)) {
  fs.copySync(plConfFileSrc, plConfFile);
}

var prefFile = 'pref.yml';
var prefFileSrc = path.resolve(excludesDir, prefFile);
if (!fs.existsSync(prefFile)) {
  fs.copySync(prefFileSrc, prefFile);
}

var binGulp = path.resolve('node_modules', '.bin', 'gulp');

new Promise(function (resolve) {
  // Install Bower if it is not installed.
  var bowerInstalled = spawnSync('bower', ['-v']);
  if (bowerInstalled.error) {
    exec('npm install -g bower', (err, stdout, stderr) => {
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
  }
  else {
    resolve();
  }
})
// Then, run the gulp install task.
.then(function () {
  exec(`${binGulp} --gulpfile node_modules/fepper/tasker.js install`, (err, stdout, stderr) => {
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
