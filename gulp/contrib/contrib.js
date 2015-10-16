/**
 * Put Gulp tasks contributed by the community in this directory and add them to
 * the more general tasks listed below.
 */
(function () {
  'use strict';

  var gulp = require('gulp');
  var runSequence = require('run-sequence');

  gulp.task('contrib:data', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:data'
  ]);

  gulp.task('contrib:frontend-copy', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:frontend-copy-css',
//    'contrib:multisite:frontend-copy-fonts',
//    'contrib:multisite:frontend-copy-images',
//    'contrib:multisite:frontend-copy-js'
  ]);

  gulp.task('contrib:lint', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:lint:htmlhint',
//    'contrib:multisite:lint:htmllint',
//    'contrib:multisite:lint:eslint',
//    'contrib:multisite:lint:jsonlint'
  ]);

  gulp.task('contrib:minify', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:minify',
  ]);

  gulp.task('contrib:once', function (cb) {
    runSequence(
// Uncomment if you wish to enable this.
//      'contrib:multisite:clean'
//      ['contrib:multisite:build', 'contrib:multisite:copy']
//      cb
    );
  });

  gulp.task('contrib:publish', [
  ]);

  gulp.task('contrib:static', [
  ]);

  gulp.task('contrib:syncback', [
  ]);

  gulp.task('contrib:tcp-ip', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:tcp-ip-load:extend'
  ]);

  gulp.task('contrib:template', [
// Uncomment if you wish to enable this.
// Change "subsite1" to use another subsite name or "all" for all subsites.
//    'contrib:multisite:subsite1'
  ]);

  gulp.task('contrib:watch', [
  ]);
})();
