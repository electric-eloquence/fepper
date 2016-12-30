'use strict';

const exec = require('child_process').exec;
const fs = require('fs');

const copy = require('./copy');

const excludesDir = 'app/excludes';

new Promise(function (resolve) {
  copy.file('conf.yml', excludesDir, resolve);
})
.then(function () {
  return new Promise(function (resolve) {
    copy.dir('extend', excludesDir, resolve);
  });
})
.then(function () {
  return new Promise(function (resolve) {
    copy.file('patternlab-config.json', excludesDir, resolve);
  });
})
.then(function () {
  return new Promise(function (resolve) {
    copy.file('pref.yml', excludesDir, resolve);
  });
})
.then(function () {
  var binGulp = path.resolve('node_modules', '.bin', 'gulp');
  exec(`${binGulp} --gulpfile app/tasker.js install`, (err, stdout, stderr) => {
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
