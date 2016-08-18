'use strict';

const conf = global.conf;
const appDir = global.appDir;
const workDir = global.workDir;

const gulp = require('gulp');

const gulpUtils = require('./utils');
const utils = require('../core/lib/utils');
const Ui = require('../core/ui/ui');

var pathIn = workDir;
var pathOut = appDir;
var ui = new Ui();

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

gulp.task('patternlab:patternsonly', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    // No easy way to use the closure when passing params.
    ui.build('patternsonly');
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
