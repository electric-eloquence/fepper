(function () {
  'use strict';

  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  // Use gulp-exec for operations that must occur synchronously within a task, or
  // for tasks that must respect the global process object.

  gulp.task('shell:install-npm', function () {
    return gulp.src('', {read: false})
      .pipe(plugins.exec('npm install'))
      .pipe(plugins.exec.reporter());
  });
})();
