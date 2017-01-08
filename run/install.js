'use strict';

const exec = require('child_process').exec;
const fs = require('fs-extra');
const path = require('path');

const excludesDir = 'node_modules/fepper/excludes';

var confFile = 'conf.yml';
var confFileSrc = path.resolve(excludesDir, confFile);
if (!fs.existsSync(confFileSrc)) {
  fs.copySync(confFileSrc, confFile);
}

var plConfFile = 'patternlab-config.json';
var plConfFileSrc = path.resolve(excludesDir, plConfFile);
if (!fs.existsSync(plConfFileSrc)) {
  fs.copySync(plConfFileSrc, plConfFile);
}

var prefFile = 'pref.yml';
var prefFileSrc = path.resolve(excludesDir, prefFile);
if (!fs.existsSync(prefFileSrc)) {
  fs.copySync(prefFileSrc, prefFile);
}

var binGulp = path.resolve('node_modules', '.bin', 'gulp');
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
