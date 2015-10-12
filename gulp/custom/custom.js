/**
 * Put custom Gulp tasks in this directory and add them to the more general
 * tasks listed below.
 */
(function () {
  'use strict';

  var gulp = require('gulp');
//  var runSequence = require('run-sequence');

  gulp.task('custom:data', [
  ]);

  gulp.task('custom:frontend-copy', [
  ]);

  gulp.task('custom:lint', [
  ]);

  gulp.task('custom:minify', [
  ]);

  gulp.task('custom:once', [
  ]);

  gulp.task('custom:publish', [
  ]);

  gulp.task('custom:static', [
  ]);

  gulp.task('custom:syncback', function (cb) {
// Uncomment if you wish to enable this.
//    runSequence(
//      'custom:css-process:compile-no-comments',
//      'patternlab:copy-css',
//      cb
//    );
  });

  gulp.task('custom:tcp-ip', [
  ]);

  gulp.task('custom:template', [
  ]);

  gulp.task('custom:watch', [
// Uncomment if you wish to enable this.
//    'custom:css-process:watch'
  ]);
})();
