(function () {
  'use strict';

  var conf = global.conf;
  var fs = require('fs-extra');
  var gulp = require('gulp');
  var runSequence = require('run-sequence');

  var utils = require('../../fepper/lib/utils');
  var rootDir = utils.rootDir();

  var pathIn = rootDir + '/' + conf.pln;
  var pathOut = rootDir;
  var PatternLab = require('../../fepper/patternlab/patternlab');
  var pl = new PatternLab(rootDir + '/' + conf.pln, rootDir);
  var plBuild;

  gulp.task('patternlab:build', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      plBuild = pl.build();
      plBuild();
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

  gulp.task('patternlab:cd-in-to-fepper', function (cb) {
    process.chdir('fepper/tasks/');
    cb();
  });

  gulp.task('patternlab:cd-out-of-fepper', function (cb) {
    process.chdir('../../');
    cb();
  });

  gulp.task('patternlab:clean', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      var plClean= pl.clean();
      plClean();
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
      var plCopy = pl.copy();
      plCopy();
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
      var plCopyCss = pl.copyCss();
      plCopyCss();
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

  gulp.task('patternlab:data', function (cb) {
    runSequence(
      'patternlab:cd-in-to-fepper',
      'fepper:appendix',
      'fepper:json-compile',
      'patternlab:cd-out-of-fepper',
      cb
    );
  });

  gulp.task('patternlab:help', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      plBuild = pl.build('help');
      plBuild();
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
      plBuild = pl.build('only-patterns');
      plBuild();
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
      plBuild = pl.build('v');
      plBuild();
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

  gulp.task('patternlab:watch', function () {
    // Need delay in order for launch to succeed consistently.
    setTimeout(function () {
      gulp.watch(conf.src + '/_data/!(_)*.json', ['patternlab:build']);
      gulp.watch(conf.src + '/_data/annotations.js', ['patternlab:copy']);
      gulp.watch(conf.src + '/_patternlab-files/**/*.mustache', ['patternlab:build']);
      gulp.watch(conf.src + '/_patterns/**/!(_)*.json', ['patternlab:build']);
      gulp.watch(conf.src + '/_patterns/**/*.mustache', ['patternlab:build']);
      gulp.watch(conf.src + '/_patterns/**/_*.json', ['patternlab:data']);
      gulp.watch(conf.src + '/css/**', ['patternlab:copy-css']);
      gulp.watch(conf.src + '/fonts/**', ['patternlab:copy']);
      gulp.watch(conf.src + '/images/**', ['patternlab:copy']);
      gulp.watch(conf.src + '/js/**', ['patternlab:copy']);
      gulp.watch(conf.src + '/static/**', ['patternlab:copy']);
      gulp.watch(conf.pub + '/!(css|patterns|styleguide)/**', ['livereload:assets']);
      gulp.watch(conf.pub + '/**/*.css', ['livereload:inject']);
      gulp.watch(conf.pub + '/index.html', ['livereload:index']);
    }, conf.timeout_main);
  });
})();
