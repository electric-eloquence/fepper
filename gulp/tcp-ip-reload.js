'use strict';

var conf = global.conf;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('tcp-ip-reload:listen', function () {
  if (!conf) {
    return;
  }

  plugins.refresh.listen({port: conf.livereload_port});
});

gulp.task('tcp-ip-reload:assetsScripts', function () {
  return gulp.src(conf.pub + '/!(_styles|patterns|styleguide)/**')
    .pipe(plugins.refresh());
});

gulp.task('tcp-ip-reload:index', function () {
  return gulp.src(conf.pub + '/index.html')
    .pipe(plugins.refresh());
});

gulp.task('tcp-ip-reload:injectStyles', function () {
  return gulp.src(conf.pub + '/**/*.css')
    .pipe(plugins.refresh());
});

gulp.task('tcp-ip-reload:watch', function () {
  // Need delay in order for launch to succeed consistently.
  setTimeout(function () {
    gulp.watch(conf.src + '/_assets/**', ['patternlab:copy']);
    gulp.watch(conf.src + '/_data/!(_appendix|data).json', ['data']);
    gulp.watch(conf.src + '/_data/_data.json', ['data']);
    gulp.watch(conf.src + '/_patternlab-files/**/*.mustache', ['patternlab:build']);
    gulp.watch(conf.src + '/_patterns/**/!(_*).json', ['patternlab:build']);
    gulp.watch(conf.src + '/_patterns/**/_*.json', ['data']);
    gulp.watch(conf.src + '/_patterns/**/*.mustache', ['patternlab:build']);
    gulp.watch(conf.src + '/_scripts/**', ['patternlab:copy']);
    gulp.watch(conf.src + '/_styles/**', ['patternlab:copy-styles']);
    gulp.watch(conf.src + '/static/**', ['patternlab:copy']);
    gulp.watch(conf.pub + '/!(_styles|patterns|styleguide)/**', ['tcp-ip-reload:assetsScripts']);
    gulp.watch(conf.pub + '/**/*.css', ['tcp-ip-reload:injectStyles']);
    gulp.watch(conf.pub + '/index.html', ['tcp-ip-reload:index']);
  }, conf.timeout_main);
});
