(function () {
  'use strict';

  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  gulp.task('test:eslint-fepper', function () {
    return gulp.src('./core/**/*.js')
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
      .pipe(plugins.eslint.failAfterError());
  });

  gulp.task('test:eslint-gulp', function () {
    return gulp.src('./gulp/**/*.js')
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
      .pipe(plugins.eslint.failAfterError());
  });

  gulp.task('test:eslint-root', function () {
    return gulp.src('./*.js')
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
      .pipe(plugins.eslint.failAfterError());
  });

  gulp.task('test:eslint-test', function () {
    return gulp.src('./test/*.js')
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
      .pipe(plugins.eslint.failAfterError());
  });

  gulp.task('test:mocha', function () {
    return gulp.src('./test/*-tests.js', {read: false})
      .pipe(plugins.mocha());
  });
})();
