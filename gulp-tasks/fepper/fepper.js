var exec = require('child_process').exec;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var utils = require('../lib/utils');

// Use gulp-exec for operations that must occur synchronously within a task, or
// for tasks that must respect the global process object.

gulp.task('fepper:appendix', function () {
  return gulp.src('', {read: false})
    .pipe(plugins.exec('node fepper/tasks/appendixer.js'))
    .pipe(plugins.exec.reporter());
});

gulp.task('fepper:gh-pages', function (cb) {
  exec('node fepper/tasks/gh-pages-path-prefixer.js', utils.log);
  cb();
});

gulp.task('fepper:json-compile', function () {
  return gulp.src('', {read: false})
    .pipe(plugins.exec('node fepper/tasks/json-compiler.js'))
    .pipe(plugins.exec.reporter());
});

gulp.task('fepper:pattern-override', function (cb) {
  exec('node fepper/tasks/pattern-overrider.js', utils.log);
  cb();
});

gulp.task('fepper:static-generate', function (cb) {
  exec('node fepper/tasks/static-generator.js', utils.log);
  cb();
});
