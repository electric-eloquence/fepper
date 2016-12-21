'use strict';

const exec = require('child_process').exec;
const fs = require('fs');

const copy = require('./copy');

const excludesDir = 'app/excludes';

new Promise(function (resolve) {
  var baseDir = 'source';

  if (!fs.existsSync(baseDir)) {
    copy(`${excludesDir}/profiles/base/${baseDir}`, baseDir, (err) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  }
  else {
    resolve();
  }
})
.then(function () {
  return new Promise(function (resolve) {
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
      resolve();
    });
  });
})
.then(function () {
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
});
