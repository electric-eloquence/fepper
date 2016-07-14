'use strict';

var conf = global.conf;
var gulp = require('gulp');

var gulpUtils = require('./utils');
var utils = require('../core/lib/utils');
var rootDir = utils.rootDir();

var pathIn = rootDir + '/' + conf.pln;
var pathOut = rootDir;
var FpUi = require('../core/fp-ui/fp-ui');
var fpUi = new FpUi(rootDir, conf);

var buildTask = gulpUtils.fsContextClosure(pathIn, fpUi, 'build', pathOut);
gulp.task('patternlab:build', buildTask);

var cleanTask = gulpUtils.fsContextClosure(pathIn, fpUi, 'clean', pathOut);
gulp.task('patternlab:clean', cleanTask);

var copyTask = gulpUtils.fsContextClosure(pathIn, fpUi, 'copy', pathOut);
gulp.task('patternlab:copy', copyTask);

var copyStylesTask = gulpUtils.fsContextClosure(pathIn, fpUi, 'copyStyles', pathOut);
gulp.task('patternlab:copy-styles', copyStylesTask);

gulp.task('patternlab:help', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    // No easy way to use the closure when passing params.
    fpUi.build('help');
    resolve();
  });
  p.then(function () {
    process.chdir(pathOut);
    cb();
  })
  .catch(function (reason) {
    utils.error(reason);
    cb();
  });
});

gulp.task('patternlab:only-patterns', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    // No easy way to use the closure when passing params.
    fpUi.build('only-patterns');
    resolve();
  });
  p.then(function () {
    process.chdir(pathOut);
    cb();
  })
  .catch(function (reason) {
    utils.error(reason);
    cb();
  });
});

gulp.task('patternlab:v', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    // No easy way to use the closure when passing params.
    fpUi.build('v');
    resolve();
  });
  p.then(function () {
    process.chdir(pathOut);
    cb();
  })
  .catch(function (reason) {
    utils.error(reason);
    cb();
  });
});
