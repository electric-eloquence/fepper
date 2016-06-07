'use strict';

var conf = global.conf;
var pref = global.pref;
var gulp = require('gulp');

var utils = require('../core/lib/utils');
var rootDir = utils.rootDir();

var pathIn = rootDir + '/core/tasks';
var pathOut = rootDir;
var Tasks = require('../core/tasks/tasks');
var tasks = new Tasks(rootDir, conf, pref);

gulp.task('fepper:copy-assets', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    // Don't have an easy way to use the closure when passing params.
    tasks.fcTest('assets', 'assets_dir');
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
    // Don't have an easy way to use the closure when passing params.
    tasks.fcTest('scripts/*', 'scripts_dir');
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
    // Don't have an easy way to use the closure when passing params.
    tasks.fcTest('styles', 'styles_dir');
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
  var p1 = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    tasks.appendix();
    resolve();
  });
  p1.then(function () {
    p2();
  })
  .catch(function (reason) {
    utils.error(reason);
    cb();
  });

  var p2 = function () {
    var p = new Promise(function (resolve, reject) {
      tasks.jsonCompile();
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
  };
});

var patternOverrideTask = utils.fsContextClosure(pathIn, tasks, 'patternOverride', pathOut);
gulp.task('fepper:pattern-override', patternOverrideTask);

var publishTask = utils.fsContextClosure(pathIn, tasks, 'publish', pathOut);
gulp.task('fepper:publish', publishTask);

var staticGenerateTask = utils.fsContextClosure(pathIn, tasks, 'staticGenerate', pathOut);
gulp.task('fepper:static-generate', staticGenerateTask);

var templateTask = utils.fsContextClosure(pathIn, tasks, 'template', pathOut);
gulp.task('fepper:template', templateTask);

gulp.task('fepper:fc-test-assets', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    tasks.fcTest('assets');
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
