(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');

  var utils = require('../../fepper/lib/utils');
  var rootDir = utils.rootDir();

  var pathIn = rootDir + '/' + conf.pln;
  var pathOut = rootDir;
  var PatternLab = require('../../fepper/patternlab/patternlab');
  var pl = new PatternLab(rootDir, conf);

  gulp.task('patternlab:build', function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      pl.build();
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
      pl.clean();
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
      pl.copy();
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
      pl.copyCss();
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
      pl.build('help');
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
      pl.build('only-patterns');
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
      pl.build('v');
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
      gulp.watch(conf.src + '/_patterns/**/_*.json', ['fepper:data']);
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
