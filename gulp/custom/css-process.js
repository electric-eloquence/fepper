/**
 * Use any CSS pre- or post-processor you wish. Or use none.
 */
(function () {
  'use strict';

//  var gulp = require('gulp');
//  var plugins = require('gulp-load-plugins')();
//  var runSequence = require('run-sequence');

//  var utilsGulp = require('../lib/utils');

// Uncomment if you want to use Stylus.
//  gulp.task('css-process', function () {
//    return gulp.src('./' + conf.src + '/css-processors/stylus/*.styl')
//      .pipe(plugins.stylus({
//        linenos: true
//      }))
//      .on('error', utilsGulp.handleError)
//      .pipe(gulp.dest('./' + conf.src + '/styles'));
// Uncomment if you want to use SCSS. Replace if you want to use something else.
//    return gulp.src('./' + conf.src + '/css-processors/scss/*.scss')
//      .pipe(plugins.sass({
//        outputStyle: 'expanded',
//        sourceComments: true
//      }))
//      .on('error', plugins.sass.logError)
//      .pipe(gulp.dest('./' + conf.src + '/styles'));
//  });

// Uncomment if you want to use fp syncback without Stylus line comments.
//  gulp.task('css-process:no-comments', function () {
//    return gulp.src('./' + conf.src + '/css-processors/stylus/*.styl')
//      .pipe(plugins.stylus({
//        linenos: false
//      }))
//      .on('error', utilsGulp.handleError)
//      .pipe(gulp.dest('./' + conf.src + '/styles'));
// Uncomment if you want to use SCSS. Replace if you want to use something else.
//    return gulp.src('./' + conf.src + '/css-processors/scss/*.scss')
//      .pipe(plugins.sass({
//        outputStyle: 'expanded',
//        sourceComments: false
//      }))
//      .on('error', plugins.sass.logError)
//      .pipe(gulp.dest('./' + conf.src + '/styles'));
//  });

// Uncomment to process css during fp syncback.
//  gulp.task('css-process:syncback', function (cb) {
//    runSequence(
//      'css-process:compile-no-comments',
//      'patternlab:copy-styles',
//      cb
//    );
//  });

// Uncomment if you want to use Stylus.
//  gulp.task('css-process:watch', function () {
//    gulp.watch('./' + conf.src + '/css-processors/stylus/**/*.styl', ['css-process']);
// Uncomment if you want to use SCSS. Replace if you want to use something else.
//    gulp.watch('./' + conf.src + '/css-processors/scss/**/*.scss', ['css-process']);
//  });
})();
