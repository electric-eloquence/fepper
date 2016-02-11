/**
 * Put custom Gulp tasks in this directory and add them to the more general
 * tasks listed below.
 */
(function () {
  'use strict';

  var gulp = require('gulp');

  gulp.task('custom:data', [
  ]);

  gulp.task('custom:frontend-copy', [
    'css-process:frontend-copy'
  ]);

  gulp.task('custom:lint', [
  ]);

  gulp.task('custom:minify', [
  ]);

  gulp.task('custom:once', [
    'css-process'
  ]);

  gulp.task('custom:publish', [
  ]);

  gulp.task('custom:static', [
  ]);

  gulp.task('custom:syncback', [
  ]);

  gulp.task('custom:tcp-ip', [
  ]);

  gulp.task('custom:template', [
  ]);

  gulp.task('custom:watch', [
    'css-process:watch'
  ]);
})();
