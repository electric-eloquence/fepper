/**
 * Use any CSS pre- or post-processor you wish. Or use none.
 */
(function () {
  'use strict';

  var gulp = require('gulp');

  gulp.task('custom:css-process', function () {
// Uncomment if you want to use Stylus.
//    return gulp.src('./' + conf.src + '/css-processors/stylus/*.styl')
//      .pipe(plugins.stylus({
//        linenos: true
//      }))
//      .on('error', utils.handleError)
//      .pipe(gulp.dest('./' + conf.src + '/css'));
// Uncomment if you want to use SCSS. Replace if you want to use something else.
//    return gulp.src('./' + conf.src + '/css-processors/scss/*.scss')
//      .pipe(plugins.sass({
//        outputStyle: 'expanded',
//        sourceComments: true
//      }))
//      .on('error', plugins.sass.logError)
//      .pipe(gulp.dest('./' + conf.src + '/css'));
  });

  gulp.task('custom:css-process:compile-no-comments', function () {
// Uncomment if you want to use node . syncback without Stylus line comments.
//    return gulp.src('./' + conf.src + '/css-processors/stylus/*.styl')
//      .pipe(plugins.stylus({
//        linenos: false
//      }))
//      .on('error', utils.handleError)
//      .pipe(gulp.dest('./' + conf.src + '/css'));
// Uncomment if you want to use SCSS. Replace if you want to use something else.
//    return gulp.src('./' + conf.src + '/css-processors/scss/*.scss')
//      .pipe(plugins.sass({
//        outputStyle: 'expanded',
//        sourceComments: false
//      }))
//      .on('error', plugins.sass.logError)
//      .pipe(gulp.dest('./' + conf.src + '/css'));
  });

  gulp.task('custom:css-process:watch', function () {
// Uncomment if you want to use Stylus.
//    gulp.watch('./' + conf.src + '/css-processors/stylus/**/*.styl', ['custom:css-process']);
// Uncomment if you want to use SCSS. Replace if you want to use something else.
//    gulp.watch('./' + conf.src + '/css-processors/scss/**/*.scss', ['custom:css-process']);
  });
})();
