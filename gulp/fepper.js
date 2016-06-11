'use strict';

var conf = global.conf;
var pref = global.pref;
var gulp = require('gulp');

var gulpUtils = require('./utils');
var utils = require('../core/lib/utils');
var rootDir = utils.rootDir();

var pathIn = rootDir + '/core/tasks';
var pathOut = rootDir;
var Tasks = require('../core/tasks/tasks');
var tasks = new Tasks(rootDir, conf, pref);

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

var publishTask = gulpUtils.fsContextClosure(pathIn, tasks, 'publish', pathOut);
gulp.task('fepper:publish', publishTask);

var staticGenerateTask = gulpUtils.fsContextClosure(pathIn, tasks, 'staticGenerate', pathOut);
gulp.task('fepper:static-generate', staticGenerateTask);

var templateTask = gulpUtils.fsContextClosure(pathIn, tasks, 'template', pathOut);
gulp.task('fepper:template', templateTask);
