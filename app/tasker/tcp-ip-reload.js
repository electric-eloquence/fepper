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

gulp.task('tcp-ip-reload:annotations', function () {
  return gulp.src(utils.pathResolve(pubDir.annotations) + '/**')
    .pipe(plugins.refresh());
});

gulp.task('tcp-ip-reload:assets', function () {
  return gulp.src(utils.pathResolve(pubDir.images) + '/**')
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

gulp.task('tcp-ip-reload:otherStyles', function () {
  return gulp.src(utils.pathResolve(pubDir.css) + '/**/*!(.css)')
    .pipe(plugins.refresh());
});

gulp.task('tcp-ip-reload:scripts', function () {
  return gulp.src(utils.pathResolve(pubDir.js) + '/**')
    .pipe(plugins.refresh());
});

// console.info(srcDir.patterns);
gulp.task('tcp-ip-reload:watch', function () {
  // An option to delay launch in case other asynchronous tasks need to complete.
  setTimeout(function () {
    // We cannot use absolute paths in the first param for gulp.watch. Therefore we must specify cwd in the 2nd.
    gulp.watch(srcDir.annotations + '/**', {cwd: global.workDir}, ['patternlab:build']);
    gulp.watch(srcDir.cssBld + '/**', {cwd: global.workDir}, ['patternlab:copy-styles']);
    gulp.watch(srcDir.data + '/_data.json', {cwd: global.workDir}, ['data']);
    gulp.watch(srcDir.data + '/listitems.json', {cwd: global.workDir}, ['patternlab:build']);
    gulp.watch(srcDir.images + '/**', {cwd: global.workDir}, ['patternlab:copy']);
    gulp.watch(srcDir.js + '/**', {cwd: global.workDir}, ['patternlab:copy']);
    gulp.watch(srcDir.meta + '/**', {cwd: global.workDir}, ['patternlab:build']);
    gulp.watch(srcDir.patterns + '/**', {cwd: global.workDir}, ['data']);
    gulp.watch(srcDir.static + '/**', {cwd: global.workDir}, ['patternlab:copy']);
    gulp.watch(pubDir.annotations + '/**', {cwd: global.workDir}, ['tcp-ip-reload:annotations']);
    gulp.watch(pubDir.css + '/**/*.css', {cwd: global.workDir}, ['tcp-ip-reload:injectStyles']);
    gulp.watch(pubDir.css + '/**/*!(.css)', {cwd: global.workDir}, ['tcp-ip-reload:otherStyles']);
    gulp.watch(pubDir.images + '/**', {cwd: global.workDir}, ['tcp-ip-reload:assets']);
    gulp.watch(pubDir.js + '/**', {cwd: global.workDir}, ['tcp-ip-reload:scripts']);
    gulp.watch(pubDir.root + '/index.html', {cwd: global.workDir}, ['tcp-ip-reload:index']);
  }, conf.timeout_main);
});
