'use strict';

const conf = global.conf;
const pref = global.pref;
const appDir = global.appDir;
const workDir = global.workDir;

const gulp = require('gulp');

const gulpUtils = require('./utils');
const Tasks = require('../core/tasks/tasks');
const utils = require('../core/lib/utils');

var pathIn = appDir + '/core/tasks';
var pathOut = workDir;
var tasks = new Tasks();

gulp.task('fepper:copy-assets', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    // No easy way to use the closure when passing params.
    tasks.frontendCopy('assets');
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

gulp.task('fepper:copy-scripts', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    // No easy way to use the closure when passing params.
    tasks.frontendCopy('scripts');
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

gulp.task('fepper:copy-styles', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    // No easy way to use the closure when passing params.
    tasks.frontendCopy('styles');
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

gulp.task('fepper:data', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    tasks.appendix();
    resolve();
  });
  p.then(function () {
    // No easy way to use the closure when chaining promised functions.
    p1();
  })
  .catch(function (reason) {
    utils.error(reason);
    cb();
  });

  var p1 = function () {
    var p2 = new Promise(function (resolve, reject) {
      tasks.jsonCompile();
      resolve();
    });
    p2.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
      cb();
    });
  };
});

var patternOverrideTask = gulpUtils.fsContextClosure(pathIn, tasks, 'patternOverride', pathOut);
gulp.task('fepper:pattern-override', patternOverrideTask);

var publishArgs = ['static'];
var publishTask = gulpUtils.fsContextClosure(pathIn, tasks, 'publish', pathOut, publishArgs);
gulp.task('fepper:publish', publishTask);

var publishArgs1 = ['.'];
var publishTask1 = gulpUtils.fsContextClosure(pathIn, tasks, 'publish', pathOut, publishArgs1);
gulp.task('fepper:publish:ui', publishTask1);

var staticGenerateTask = gulpUtils.fsContextClosure(pathIn, tasks, 'staticGenerate', pathOut);
gulp.task('fepper:static-generate', staticGenerateTask);

var templateTask = gulpUtils.fsContextClosure(pathIn, tasks, 'template', pathOut);
gulp.task('fepper:template', templateTask);
