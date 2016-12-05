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
    gulp.watch('**', {cwd: utils.pathResolve(srcDir.images)}, ['patternlab:copy']);
    gulp.watch('_data.json', {cwd: utils.pathResolve(srcDir.data)}, ['data']);
    gulp.watch('listitems.json', {cwd: utils.pathResolve(srcDir.data)}, ['patternlab:build']);
    gulp.watch('annotations.json', {cwd: utils.pathResolve(srcDir.annotations)}, ['patternlab:build']);
    gulp.watch('**/*.mustache', {cwd: utils.pathResolve(srcDir.meta)}, ['patternlab:build']);
    gulp.watch('**', {cwd: utils.pathResolve(srcDir.patterns)}, ['data']);
    gulp.watch('**', {cwd: utils.pathResolve(srcDir.js)}, ['patternlab:copy']);
    gulp.watch('**', {cwd: utils.pathResolve(srcDir.css)}, ['patternlab:copy-styles']);
    gulp.watch('static/**', {cwd: utils.pathResolve(srcDir.root)}, ['patternlab:copy']);
    gulp.watch('!(_styles|patterns|styleguide)/**', {cwd: utils.pathResolve(pubDir.root)}, ['tcp-ip-reload:assetsScripts']);
    gulp.watch('**/*.css', {cwd: utils.pathResolve(pubDir.css)}, ['tcp-ip-reload:injectStyles']);
    gulp.watch('index.html', {cwd: utils.pathResolve(pubDir.root)}, ['tcp-ip-reload:index']);
  }, conf.timeout_main);
});
