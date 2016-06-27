/**
 * Put tasks defined in ~extend.js appended files within the more general tasks
 * listed below.
 */
'use strict';

var gulp = require('gulp');

gulp.task('custom:data', [
]);

gulp.task('custom:frontend-copy', [
// Uncomment if you wish to enable Stylus processing.
//  'css-process:frontend-copy'
]);

gulp.task('custom:lint', [
]);

gulp.task('custom:minify', [
]);

gulp.task('custom:once', [
// Uncomment if you wish to enable Stylus processing.
//  'css-process'
]);

// You can only publish one site at a time. If the custom:publish task is to
// be enabled, the core fepper:publish task should be disabled by unsetting
// the gh_pages_src setting in pref.yml.
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
// Uncomment if you wish to enable Stylus processing.
//  'css-process:watch'
]);
