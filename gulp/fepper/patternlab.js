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
    var p1 = new Promise(function (resolve, reject) {
      process.chdir(rootDir + '/fepper/tasks');
      var fpAppendix = pl.data()[0];
      fpAppendix(rootDir + '/' + conf.src);
      resolve();
    });
    p1.then(function () {
      f2();
    })
    .catch(function (reason) {
      utils.error(reason);
    });

    var f2 = function () {
      var p2 = new Promise(function (resolve, reject) {
        var fpJsonCompile= pl.data()[1];
        fpJsonCompile(rootDir + '/' + conf.src);
        resolve();
      });
      p2.then(function () {
        process.chdir(rootDir);
        cb();
      })
      .catch(function (reason) {
        utils.error(reason);
      });
    };
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
