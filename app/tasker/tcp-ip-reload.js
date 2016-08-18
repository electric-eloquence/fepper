'use strict';

const conf = global.conf;
const pubDir = global.conf.ui.paths.public;
const srcDir = global.conf.ui.paths.source;

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const utils = require('../core/lib/utils');

gulp.task('tcp-ip-reload:listen', function () {
  plugins.refresh.listen({port: conf.livereload_port});
});

gulp.task('tcp-ip-reload:assetsScripts', function () {
  return gulp.src(utils.pathResolve(pubDir.root) + '/!(_styles|patterns|styleguide)/**')
    .pipe(plugins.refresh());
});

gulp.task('tcp-ip-reload:index', function () {
  return gulp.src(utils.pathResolve(pubDir.root) + '/index.html')
    .pipe(plugins.refresh());
});

gulp.task('tcp-ip-reload:injectStyles', function () {
  return gulp.src(utils.pathResolve(pubDir.css) + '/**/*.css')
    .pipe(plugins.refresh());
});

gulp.task('tcp-ip-reload:watch', function () {
  // Need delay in order for launch to succeed consistently.
  setTimeout(function () {
    gulp.watch(utils.pathResolve(srcDir.images) + '/**', ['patternlab:copy']);
    gulp.watch(utils.pathResolve(srcDir.data) + '/_data.json', ['data']);
    gulp.watch(utils.pathResolve(srcDir.data) + '/listitems.json', ['patternlab:build']);
    gulp.watch(utils.pathResolve(srcDir.annotations) + '/annotations.json', ['patternlab:build']);
    gulp.watch(utils.pathResolve(srcDir.meta) + '/**/*.mustache', ['patternlab:build']);
    gulp.watch(utils.pathResolve(srcDir.patterns) + '/**/!(_*).json', ['patternlab:build']);
    gulp.watch(utils.pathResolve(srcDir.patterns) + '/**/_*.json', ['data']);
    gulp.watch(utils.pathResolve(srcDir.patterns) + '/**/*.mustache', ['patternlab:build']);
    gulp.watch(utils.pathResolve(srcDir.js) + '/**', ['patternlab:copy']);
    gulp.watch(utils.pathResolve(srcDir.css) + '/**', ['patternlab:copy-styles']);
    gulp.watch(utils.pathResolve(srcDir.root) + '/static/**', ['patternlab:copy']);
    gulp.watch(utils.pathResolve(pubDir.root) + '/!(_styles|patterns|styleguide)/**', ['tcp-ip-reload:assetsScripts']);
    gulp.watch(utils.pathResolve(pubDir.css) + '/**/*.css', ['tcp-ip-reload:injectStyles']);
    gulp.watch(utils.pathResolve(pubDir.root) + '/index.html', ['tcp-ip-reload:index']);
  }, conf.timeout_main);
});
