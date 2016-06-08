'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('test:eslint-fepper', function () {
  return gulp.src('./core/**/*.js')
    // An ESLint bug requires that the node env be defined here and not in
    // .eslintrc.json.
    .pipe(plugins.eslint({envs: ['node']}))
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('test:eslint-gulp', function () {
  return gulp.src('./gulp/**/*.js')
    // An ESLint bug requires that the node env be defined here and not in
    // .eslintrc.json.
    .pipe(plugins.eslint({envs: ['node']}))
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('test:eslint-root', function () {
  return gulp.src('./*.js')
    // An ESLint bug requires that the node env be defined here and not in
    // .eslintrc.json.
    .pipe(plugins.eslint({envs: ['node']}))
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('test:eslint-test', function () {
  return gulp.src('./test/*.js')
    // An ESLint bug requires that the node env be defined here and not in
    // .eslintrc.json.
    .pipe(plugins.eslint({envs: ['node']}))
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('test:mocha', function () {
  return gulp.src('./test/*-tests.js', {read: false})
    .pipe(plugins.mocha());
});
