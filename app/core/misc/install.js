'use strict';

const exec = require('child_process').exec;
const fs = require('fs');

const copy = require('./copy');

const excludesDir = 'app/excludes';

function copyDir(dir, srcDir, cb) {
  if (!fs.existsSync(dir)) {
    copy(`${srcDir}/${dir}`, dir, (err) => {
      if (err) {
        throw err;
      }
      if (typeof cb === 'function') {
        cb();
      }
    });
  }
  else if (typeof cb === 'function') {
    cb();
  }
}

function copyFile(file, srcDir, cb) {
  if (!fs.existsSync(file)) {
    fs.readFile(`${srcDir}/${file}`, (err, data) => {
      if (err) {
        throw err;
      }
      fs.writeFileSync(file, data);
      cb();
    });
  }
  else {
    cb();
  }
}

new Promise(function (resolve) {
  copyFile('conf.yml', excludesDir, resolve);
})
.then(function () {
  return new Promise(function (resolve) {
    copyDir('extend', excludesDir, resolve);
  });
})
.then(function () {
  return new Promise(function (resolve) {
    copyFile('patternlab-config.json', excludesDir, resolve);
  });
})
.then(function () {
  return new Promise(function (resolve) {
    copyFile('pref.yml', excludesDir, resolve);
  });
})
.then(function () {
  exec('./node_modules/.bin/gulp --gulpfile app/tasker.js install', (err, stdout, stderr) => {
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
