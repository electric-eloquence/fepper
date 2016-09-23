'use strict';

const pubDir = global.conf.ui.paths.public;
const srcDir = global.conf.ui.paths.source;

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const utils = require('../core/lib/utils');

gulp.task('lint:htmlhint', function () {
  return gulp.src(utils.pathResolve(pubDir.patterns) + '/*/!(index|*escaped).html')
    .pipe(plugins.htmlhint('.htmlhintrc'))
    .pipe(plugins.htmlhint.reporter());
});

gulp.task('lint:htmllint', function () {
  return gulp.src(utils.pathResolve(pubDir.patterns) + '/*/!(index|*escaped).html')
    .pipe(plugins.htmllint());
});

gulp.task('lint:eslint', function () {
  return gulp.src(utils.pathResolve(srcDir.js) + '/src/**/*.js')
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('lint:jsonlint', function () {
  return gulp.src([utils.pathResolve(srcDir.data) + '/**/*.json', utils.pathResolve(srcDir.patterns) + '/**/*.json'])
    .pipe(plugins.jsonlint())
    .pipe(plugins.jsonlint.reporter());
});
