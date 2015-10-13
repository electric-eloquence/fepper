(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  gulp.task('tcp-ip-reload:listen', function () {
    if (!conf) {
      return;
    }

    plugins.livereload.listen({port: conf.livereload_port});
  });

  gulp.task('tcp-ip-reload:assets', function () {
    return gulp.src(conf.pub + '/!(css|patterns|styleguide)/**')
      .pipe(plugins.livereload());
  });

  gulp.task('tcp-ip-reload:index', function () {
    return gulp.src(conf.pub + '/index.html')
      .pipe(plugins.livereload());
  });

  gulp.task('tcp-ip-reload:inject', function () {
    return gulp.src(conf.pub + '/**/*.css')
      .pipe(plugins.livereload());
  });

  gulp.task('tcp-ip-reload:watch', function () {
    // Need delay in order for launch to succeed consistently.
    setTimeout(function () {
      gulp.watch(conf.src + '/_data/!(_)*.json', ['patternlab:build']);
      gulp.watch(conf.src + '/_data/annotations.js', ['patternlab:copy']);
      gulp.watch(conf.src + '/_patternlab-files/**/*.mustache', ['patternlab:build']);
      gulp.watch(conf.src + '/_patterns/**/!(_)*.json', ['patternlab:build']);
      gulp.watch(conf.src + '/_patterns/**/*.mustache', ['patternlab:build']);
      gulp.watch(conf.src + '/_patterns/**/_*.json', ['fepper:data']);
      gulp.watch(conf.src + '/css/**', ['patternlab:copy-css']);
      gulp.watch(conf.src + '/fonts/**', ['patternlab:copy']);
      gulp.watch(conf.src + '/images/**', ['patternlab:copy']);
      gulp.watch(conf.src + '/js/**', ['patternlab:copy']);
      gulp.watch(conf.src + '/static/**', ['patternlab:copy']);
      gulp.watch(conf.pub + '/!(css|patterns|styleguide)/**', ['tcp-ip-reload:assets']);
      gulp.watch(conf.pub + '/**/*.css', ['tcp-ip-reload:inject']);
      gulp.watch(conf.pub + '/index.html', ['tcp-ip-reload:index']);
    }, conf.timeout_main);
  });
})();
