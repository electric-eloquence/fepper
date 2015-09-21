var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('mocha', function () {
  return gulp.src('./test/*-tests.js', {read: false})
    .pipe(plugins.mocha());
});
