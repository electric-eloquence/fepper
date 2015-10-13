(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');

  var utils = require('../../core/lib/utils');
  var rootDir = utils.rootDir();

  var pathIn = rootDir + '/' + conf.pln;
  var pathOut = rootDir;
  var FpPln = require('../../core/fp-pln/fp-pln');
  var fpPln = new FpPln(rootDir, conf);

  gulp.task('patternlab:build', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      fpPln.build();
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
    });
  });

  gulp.task('patternlab:clean', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      fpPln.clean();
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
    });
  });

  gulp.task('patternlab:copy', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      fpPln.copy();
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
    });
  });

  gulp.task('patternlab:copy-css', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      fpPln.copyCss();
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
    });
  });

  gulp.task('patternlab:help', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      fpPln.build('help');
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
    });
  });

  gulp.task('patternlab:only-patterns', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      fpPln.build('only-patterns');
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
    });
  });

  gulp.task('patternlab:v', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      fpPln.build('v');
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
    });
  });
})();
