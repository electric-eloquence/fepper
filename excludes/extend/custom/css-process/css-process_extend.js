/**
 * Use any CSS pre- or post-processor you wish. Or use none.
 */
'use strict';

var conf = global.conf;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var utilsGulp = require('../../../gulp/utils');

gulp.task('css-process', function () {
  return gulp.src('./' + conf.src + '/css-processors/stylus/*.styl')
    .pipe(plugins.stylus({
      linenos: true
    }))
    .on('error', utilsGulp.handleError)
    .pipe(gulp.dest('./' + conf.src + '/styles'));

// Delete the previous block and uncomment the following block to use SCSS.
// Replace them both to use something else.
//  return gulp.src('./' + conf.src + '/css-processors/scss/*.scss')
//    .pipe(plugins.sass({
//      outputStyle: 'expanded',
//      sourceComments: true
//    }))
//    .on('error', plugins.sass.logError)
//    .pipe(gulp.dest('./' + conf.src + '/styles'));
});

// This runs the CSS processor without outputting line comments.
// You probably want this to process CSS destined for production.
gulp.task('css-process:no-comments', function () {
  return gulp.src('./' + conf.src + '/css-processors/stylus/*.styl')
    .pipe(plugins.stylus({
      linenos: false
    }))
    .on('error', utilsGulp.handleError)
    .pipe(gulp.dest('./' + conf.src + '/styles'));

// Delete the previous block and uncomment the following block to use SCSS.
// Replace them both to use something else.
//  return gulp.src('./' + conf.src + '/css-processors/scss/*.scss')
//    .pipe(plugins.sass({
//      outputStyle: 'expanded',
//      sourceComments: false
//    }))
//    .on('error', plugins.sass.logError)
//    .pipe(gulp.dest('./' + conf.src + '/styles'));
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

// Delete the previous block and uncomment the following block to use SCSS.
// Replace them both to use something else.
//    gulp.watch('./' + conf.src + '/css-processors/scss/**/*.scss', ['css-process']);
});
