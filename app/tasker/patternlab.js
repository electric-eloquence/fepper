'use strict';

const gulp = require('gulp');

const Ui = require('../core/ui/ui');

var ui = new Ui();

gulp.task('patternlab:build', function (cb) {
  ui.build();
  cb();
});

gulp.task('patternlab:clean', function (cb) {
  ui.clean();
  cb();
});

gulp.task('patternlab:copy', function (cb) {
  ui.copy();
  cb();
});

gulp.task('patternlab:copy-styles', function (cb) {
  ui.copyStyles();
  cb();
});

gulp.task('patternlab:help', function (cb) {
  ui.build('help');
  cb();
});

gulp.task('patternlab:patternsonly', function (cb) {
  ui.build('patternsonly');
  cb();
});

gulp.task('patternlab:v', function (cb) {
  ui.build('v');
  cb();
});
