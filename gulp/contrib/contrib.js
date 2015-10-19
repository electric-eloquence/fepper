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
// Change "subsite1" to use another subsite name or "all" for all subsites.
//    'contrib:multisite:frontend-copy:subsite1',
  ]);

  gulp.task('contrib:lint', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:lint',
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
// You can only specify one site at a time, and if this is enabled, the main
// fp fepper:publish task must be disabled in conf.yml.
//    'contrib:multisite:publish:subsite1',
  ]);

  gulp.task('contrib:static', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:static',
  ]);

  gulp.task('contrib:syncback', function (cb) {
// Uncomment if you wish to enable this.
//    runSequence(
//      'contrib:multisite:lint',
//      'contrib:multisite:minify',
// Change "subsite1" to use another subsite name or "all" for all subsites.
//      'contrib:multisite:frontend-copy:subsite1',
//      'contrib:multisite:template:subsite1',
//      cb
//    );
// If using run-sequence, delete the following cb() and make sure there's a cb
// entered as a parameter.
    cb();
  });

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
// Uncomment if you wish to enable this.
//    'contrib:multisite:watch',
  ]);
})();
