/**
 * Put tasks defined in ~extend.js appended files within the more general tasks
 * listed below.
 */
'use strict';

var gulp = require('gulp');

gulp.task('contrib:data', [
]);

gulp.task('contrib:frontend-copy', [
// Uncomment if you wish to enable this.
//  'stylus:frontend-copy'
]);

gulp.task('contrib:once', [
// Uncomment if you wish to enable this.
//  'stylus:once'
]);

gulp.task('contrib:static', [
]);

gulp.task('contrib:syncback', [
]);

gulp.task('contrib:tcp-ip', [
]);

gulp.task('contrib:template', [
]);

// No pre or postprocessing for watch tasks.
gulp.task('contrib:watch', [
// Uncomment if you wish to enable this.
//  'stylus:watch'
]);
