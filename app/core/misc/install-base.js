'use strict';

const exec = require('child_process').exec;
const fs = require('fs');

const copy = require('./copy');

const excludesDir = 'app/excludes';

function taskRun() {
  exec('./node_modules/.bin/gulp --gulpfile app/tasker.js fepper:data', (err, stdout, stderr) => {
    if (err) {
      throw err;
    }
    if (stderr) {

      /* eslint-disable no-console */
      console.log(stderr);

      /* eslint-enable no-console */
    }
  });
}

function npmInstall() {
  exec('npm install', (err, stdout, stderr) => {
    if (err) {
      throw err;
    }
    if (stderr) {

      /* eslint-disable no-console */
      console.log(stderr);

      /* eslint-enable no-console */
      fs.appendFileSync('install.log', stderr);
    }

    /* eslint-disable no-console */
    console.log(stdout);

    /* eslint-enable no-console */
    fs.writeFileSync('install.log', stdout);
    taskRun();
  });
}

function copySource() {
  var dir = 'source';

  if (!fs.existsSync(dir)) {
    copy(`${excludesDir}/profiles/base/${dir}`, dir, (err) => {
      if (err) {
        throw err;
      }
      npmInstall();
    });
  }
  else {
    npmInstall();
  }
}

function init() {
  copySource();
}

init();
