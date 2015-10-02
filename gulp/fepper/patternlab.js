(function () {
  'use strict';

  var conf = global.conf;
  var fs = require('fs-extra');
  var gulp = require('gulp');
  var runSequence = require('run-sequence');

  function patternlab_build(arg, chdir) {
    if (typeof chdir === 'string') {
      process.chdir(chdir);
    }
    var patternlab_engine = require('../../' + conf.bld + '/patternlab.js');
    var patternlab = patternlab_engine();

    if (arg === 'v') {
      patternlab.version();
    }
    else if (arg === 'only-patterns') {
      patternlab.build_patterns_only();
    }
    else if (arg === 'help') {
      patternlab.help();
    }
    else {
      patternlab.build();
    }
  }

  function patternlab_copy() {
    gulp.src('./source/_data/annotations.js')
      .pipe(gulp.dest('./public/data/'));
    gulp.src('./source/css/**')
      .pipe(gulp.dest('./public/css/'));
    gulp.src('./source/fonts/**')
      .pipe(gulp.dest('./public/fonts/'));
    gulp.src('./source/images/**')
      .pipe(gulp.dest('./public/images/'));
    gulp.src('./source/js/**')
      .pipe(gulp.dest('./public/js/'));
    gulp.src('./source/static/**')
      .pipe(gulp.dest('./public/static/'));
  }

  gulp.task('patternlab:build', function (cb) {
    patternlab_build();
    cb();
  });

  gulp.task('patternlab:build-cd', function (cb) {
    runSequence(
      'patternlab:cd-in',
      'patternlab:build',
      'patternlab:cd-out',
      cb
    );
  });

  gulp.task('patternlab:cd-in', function (cb) {
    process.chdir(conf.pln);
    cb();
  });

  gulp.task('patternlab:cd-in-to-fepper', function (cb) {
    process.chdir('../fepper/tasks/');
    cb();
  });

  gulp.task('patternlab:cd-out', function (cb) {
    process.chdir('..');
    cb();
  });

  gulp.task('patternlab:cd-out-of-fepper', function (cb) {
    process.chdir('../../' + conf.pln);
    cb();
  });

  gulp.task('patternlab:clean', function (cb) {
    fs.removeSync('./public/patterns');
    cb();
  });

  gulp.task('patternlab:copy', function (cb) {
    patternlab_copy();
    cb();
  });

  gulp.task('patternlab:copy-cd', function (cb) {
    runSequence(
      'patternlab:cd-in',
      'patternlab:copy',
      'patternlab:cd-out',
      cb
    );
  });

  gulp.task('patternlab:copy-css', function () {
    return gulp.src(conf.src + '/css/**')
      .pipe(gulp.dest(conf.pub + '/css/'));
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
    patternlab_build('help', conf.pln);
    cb();
  });

  gulp.task('patternlab:only-patterns', function (cb) {
    patternlab_build('only-patterns', conf.pln);
    cb();
  });

  gulp.task('patternlab:v', function (cb) {
    patternlab_build('v', conf.pln);
    cb();
  });

  gulp.task('patternlab:watch', function () {
    // Need delay in order for launch to succeed consistently.
    setTimeout(function () {
      gulp.watch(conf.src + '/_data/!(_)*.json', ['patternlab:build-cd']);
      gulp.watch(conf.src + '/_data/annotations.js', ['patternlab:copy-cd']);
      gulp.watch(conf.src + '/_patternlab-files/**/*.mustache', ['patternlab:build-cd']);
      gulp.watch(conf.src + '/_patterns/**/!(_)*.json', ['patternlab:build-cd']);
      gulp.watch(conf.src + '/_patterns/**/*.mustache', ['patternlab:build-cd']);
      gulp.watch(conf.src + '/_patterns/**/_*.json', ['patternlab:data-cd']);
      gulp.watch(conf.src + '/css/**', ['patternlab:copy-css']);
      gulp.watch(conf.src + '/fonts/**', ['patternlab:copy-cd']);
      gulp.watch(conf.src + '/images/**', ['patternlab:copy-cd']);
      gulp.watch(conf.src + '/js/**', ['patternlab:copy-cd']);
      gulp.watch(conf.src + '/static/**', ['patternlab:copy-cd']);
      gulp.watch(conf.pub + '/!(css|patterns|styleguide)/**', ['livereload:assets']);
      gulp.watch(conf.pub + '/**/*.css', ['livereload:inject']);
      gulp.watch(conf.pub + '/index.html', ['livereload:index']);
    }, conf.timeout_main);
  });
})();
