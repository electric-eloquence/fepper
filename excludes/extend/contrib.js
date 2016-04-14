/**
 * Put tasks defined in _extend.js appended files within the more general tasks 
 * listed below.
 */
(function () {
  'use strict';

  var gulp = require('gulp');

  gulp.task('contrib:data', [
// Uncomment if you wish to enable this.
//    'multisite:data'
  ]);

  gulp.task('contrib:frontend-copy', [
// Uncomment if you wish to enable this.
// Change "subsite1" to use another subsite name or "all" for all subsites.
//    'multisite:frontend-copy:subsite1'
  ]);

  gulp.task('contrib:lint', [
// Uncomment if you wish to enable this.
//    'multisite:lint'
  ]);

  gulp.task('contrib:minify', [
// Uncomment if you wish to enable this.
//    'multisite:minify'
  ]);

  gulp.task('contrib:once', [
// Uncomment if you wish to enable this.
//    'multisite:once'
  ]);

  // You can only publish one site at a time. If the contrib:publish task is to 
  // be enabled, the core fepper:publish task should be disabled by unsetting 
  // the gh_pages_src setting in pref.yml.
  gulp.task('contrib:publish', [
// Uncomment if you wish to enable this.
//    'multisite:publish:subsite1'
  ]);

  gulp.task('contrib:static', [
// Uncomment if you wish to enable this.
//    'multisite:static'
  ]);

  gulp.task('contrib:syncback', [
// Uncomment if you wish to enable this.
// Change "subsite1" to use another subsite name or "all" for all subsites.
//    'multisite:syncback:subsite1'
  ]);

  gulp.task('contrib:tcp-ip', [
// Uncomment if you wish to enable this.
//    'multisite:tcp-ip'
  ]);

  gulp.task('contrib:template', [
// Uncomment if you wish to enable this.
// Change "subsite1" to use another subsite name or "all" for all subsites.
//    'multisite:template:subsite1'
  ]);

  // No pre or postprocessing for watch tasks.
  gulp.task('contrib:watch', [
// Uncomment if you wish to enable this.
//    'multisite:watch'
  ]);
})();
