'use strict';

var conf = global.conf;
var gulp = require('gulp');

var gulpUtils = require('./utils');
var utils = require('../core/lib/utils');
var rootDir = utils.rootDir();

var pathIn = rootDir + '/' + conf.pln;
var pathOut = rootDir;
var Ui = require('../core/ui/ui');
var ui = new Ui(rootDir, conf);

var buildTask = gulpUtils.fsContextClosure(pathIn, ui, 'build', pathOut);
gulp.task('patternlab:build', buildTask);

var cleanTask = gulpUtils.fsContextClosure(pathIn, ui, 'clean', pathOut);
gulp.task('patternlab:clean', cleanTask);

var copyTask = gulpUtils.fsContextClosure(pathIn, ui, 'copy', pathOut);
gulp.task('patternlab:copy', copyTask);

var copyStylesTask = gulpUtils.fsContextClosure(pathIn, ui, 'copyStyles', pathOut);
gulp.task('patternlab:copy-styles', copyStylesTask);

gulp.task('patternlab:help', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    // No easy way to use the closure when passing params.
    ui.build('help');
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
    ui.build('only-patterns');
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
    ui.build('v');
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
