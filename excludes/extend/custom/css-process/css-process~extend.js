/**
 * Supplying Stylus tasks for the custom extension example because of Stylus's
 * compatibility with JavaScript and PHP. See ui/source/_scripts/src/variables.styl
 */
'use strict';

var conf = global.conf;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var utilsGulp = require('../../../tasker/utils');

gulp.task('css-process', function () {
  return gulp.src('./' + conf.src + '/css-processors/stylus/*.styl')
    .pipe(plugins.stylus({
      linenos: true
    }))
    .on('error', utilsGulp.handleError)
    .pipe(gulp.dest('./' + conf.src + '/_styles'));
});

// This runs the CSS processor without outputting line comments.
// You probably want this to process CSS destined for production.
gulp.task('css-process:no-comments', function () {
  return gulp.src('./' + conf.src + '/css-processors/stylus/*.styl')
    .pipe(plugins.stylus({
      linenos: false
    }))
    .on('error', utilsGulp.handleError)
    .pipe(gulp.dest('./' + conf.src + '/_styles'));
});

gulp.task('css-process:frontend-copy', function (cb) {
  runSequence(
    'css-process:compile-no-comments',
    'patternlab:copy-styles',
    cb
  );
});

gulp.task('css-process:watch', function () {
  gulp.watch('./' + conf.src + '/css-processors/stylus/**/*.styl', ['css-process']);
});
