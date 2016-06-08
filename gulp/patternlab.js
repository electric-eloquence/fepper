'use strict';

var conf = global.conf;
var gulp = require('gulp');

var gulpUtils = require('./utils');
var utils = require('../core/lib/utils');
var rootDir = utils.rootDir();

var pathIn = rootDir + '/' + conf.pln;
var pathOut = rootDir;
var FpPln = require('../core/fp-pln/fp-pln');
var fpPln = new FpPln(rootDir, conf);

var buildTask = gulpUtils.fsContextClosure(pathIn, fpPln, 'build', pathOut);
gulp.task('patternlab:build', buildTask);

var cleanTask = gulpUtils.fsContextClosure(pathIn, fpPln, 'clean', pathOut);
gulp.task('patternlab:clean', cleanTask);

var copyTask = gulpUtils.fsContextClosure(pathIn, fpPln, 'copy', pathOut);
gulp.task('patternlab:copy', copyTask);

var copyStylesTask = gulpUtils.fsContextClosure(pathIn, fpPln, 'copyStyles', pathOut);
gulp.task('patternlab:copy-styles', copyStylesTask);

gulp.task('patternlab:help', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    // No easy way to use the closure when passing params.
    fpPln.build('help');
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
    fpPln.build('only-patterns');
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
    fpPln.build('v');
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
