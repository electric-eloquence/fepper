/**
 * Put Gulp tasks contributed by the community in this directory and add them to
 * the more general tasks listed below.
 */
(function () {
  'use strict';

  var gulp = require('gulp');

  gulp.task('contrib:data', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:data'
  ]);

  gulp.task('contrib:frontend-copy', [
// Uncomment if you wish to enable this.
// Change "subsite1" to use another subsite name or "all" for all subsites.
//    'contrib:multisite:frontend-copy:subsite1'
  ]);

  gulp.task('contrib:lint', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:lint'
  ]);

  gulp.task('contrib:minify', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:minify'
  ]);

  gulp.task('contrib:once', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:once'
  ]);

  gulp.task('contrib:publish', [
// Uncomment if you wish to enable this.
// You can only publish one site at a time. If the multisite publish task is to
// be enabled, the main fp fepper:publish task must be disabled by unsetting the
// gh_pages_src setting in conf.yml.
//    'contrib:multisite:publish:subsite1'
  ]);

  gulp.task('contrib:static', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:static'
  ]);

  gulp.task('contrib:syncback', [
// Uncomment if you wish to enable this.
// Change "subsite1" to use another subsite name or "all" for all subsites.
//    'contrib:multisite:syncback:subsite1'
  ]);

  gulp.task('contrib:tcp-ip', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:tcp-ip'
  ]);

  gulp.task('contrib:template', [
// Uncomment if you wish to enable this.
// Change "subsite1" to use another subsite name or "all" for all subsites.
//    'contrib:multisite:template:subsite1'
  ]);

  gulp.task('contrib:watch', [
// Uncomment if you wish to enable this.
//    'contrib:multisite:watch'
  ]);
})();
