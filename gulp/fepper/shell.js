var conf = global.conf;
var exec = require('child_process').exec;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

// Use gulp-exec for operations that must occur synchronously within a task, or
// for tasks that must respect the global process object.

gulp.task('shell:install-npm', function () {
  return gulp.src('', {read: false})
    .pipe(plugins.exec('npm install'))
    .pipe(plugins.exec.reporter());
});

gulp.task('shell:node-kill', function (cb) {
  if (conf.node_kill) {
    // Do not log output.
    exec('killall node');
    exec('taskkill /im node.exe');
  }
  cb();
});
