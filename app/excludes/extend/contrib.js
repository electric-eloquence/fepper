/**
 * Put tasks defined in ~extend.js appended files within the more general tasks
 * listed below.
 */
'use strict';

var gulp = require('gulp');

gulp.task('contrib:data', [
// Uncomment if you wish to enable this.
//  'multisite:data'
]);

gulp.task('contrib:frontend-copy', [
// Uncomment if you wish to enable this.
// Change "subsite1" to use another subsite name or "all" for all subsites.
//  'multisite:frontend-copy:subsite1'
]);

gulp.task('contrib:once', [
// Uncomment if you wish to enable this.
//  'multisite:once'
]);

gulp.task('contrib:static', [
// Uncomment if you wish to enable this.
//  'multisite:static'
]);

gulp.task('contrib:syncback', [
// Uncomment if you wish to enable this.
// Change "subsite1" to use another subsite name or "all" for all subsites.
//  'multisite:syncback:subsite1'
]);

gulp.task('contrib:tcp-ip', [
// Uncomment if you wish to enable this.
//  'multisite:tcp-ip'
]);

gulp.task('contrib:template', [
// Uncomment if you wish to enable this.
// Change "subsite1" to use another subsite name or "all" for all subsites.
//  'multisite:template:subsite1'
]);

// No pre or postprocessing for watch tasks.
gulp.task('contrib:watch', [
// Uncomment if you wish to enable this.
//  'multisite:watch'
]);
