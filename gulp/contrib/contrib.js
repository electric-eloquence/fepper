/**
 * Put Gulp tasks contributed by the community in this directory and add them to
 * the more general tasks listed below.
 */
(function () {
  'use strict';

  var gulp = require('gulp');
//  var runSequence = require('run-sequence');

  gulp.task('contrib:data', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:data'
  ]);

  gulp.task('contrib:frontend-copy', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:frontend-copy-assets',
//    'contrib:multisite:frontend-copy-scripts',
//    'contrib:multisite:frontend-copy-styles',
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
// Uncomment if you wish to enable this.
//    runSequence(
//      'contrib:multisite:clean'
//      ['contrib:multisite:build', 'contrib:multisite:copy']
//      cb
//    );
// If using run-sequence, delete the following cb() and make sure there's a cb
// entered as a parameter.
    cb();
  });

  gulp.task('contrib:publish', [
// Uncomment if you wish to enable this.
// You can only specify one site at a time, and if this is the case, the main
// fp fepper:publish task must be disabled in conf.yml.
//    'contrib:multisite:publish:subsite1',
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
