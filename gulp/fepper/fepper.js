(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');

  var fepper = require('../../fepper/tasks/tasks.js');
  var utils = require('../../fepper/lib/utils');
  var rootDir = utils.rootDir();

  gulp.task('fepper:appendix', function (cb) {
    fepper.appendix(rootDir + '/' + conf.src);
    cb();
  });

  gulp.task('fepper:cd-in', function (cb) {
    process.chdir('fepper/tasks');
    cb();
  });

  gulp.task('fepper:cd-out', function (cb) {
    process.chdir('../..');
    cb();
  });

  gulp.task('fepper:copy-css', function () {
    if (typeof conf.backend.synced_dirs.css_dir === 'string' && conf.backend.synced_dirs.css_dir.match(/^[\w.\/-]+$/)) {
      return gulp.src(rootDir + '/' + conf.src + '/css/*')
        .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.css_dir));
    }
  });

  gulp.task('fepper:copy-fonts', function () {
    if (typeof conf.backend.synced_dirs.fonts_dir === 'string' && conf.backend.synced_dirs.fonts_dir.match(/^[\w.\/-]+$/)) {
      return gulp.src(rootDir + '/' + conf.src + '/fonts/*')
        .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.fonts_dir));
    }
  });

  gulp.task('fepper:copy-images', function () {
    if (typeof conf.backend.synced_dirs.images_dir === 'string' && conf.backend.synced_dirs.images_dir.match(/^[\w.\/-]+$/)) {
      return gulp.src(rootDir + '/' + conf.src + '/images/*')
        .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.images_dir));
    }
  });

  gulp.task('fepper:copy-js', function () {
    if (typeof conf.backend.synced_dirs.js_dir === 'string' && conf.backend.synced_dirs.js_dir.match(/^[\w.\/-]+$/)) {
      return gulp.src(rootDir + '/' + conf.src + '/js/*/**/*')
        .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.js_dir));
    }
  });

  gulp.task('fepper:gh-pages', function (cb) {
    fepper.ghPagesPrefix();
    cb();
  });

  gulp.task('fepper:json-compile', function (cb) {
    fepper.jsonCompile(rootDir + '/' + conf.src);
    cb();
  });

  gulp.task('fepper:pattern-override', function (cb) {
    fepper.patternOverride(rootDir + '/' + conf.pub + '/js/pattern-overrider.js');
    cb();
  });

  gulp.task('fepper:static-generate', function (cb) {
    fepper.staticGenerate();
    cb();
  });

  gulp.task('fepper:template', function (cb) {
    if (typeof conf.backend.synced_dirs.templates_dir === 'string' && conf.backend.synced_dirs.templates_dir.match(/^[\w.\/-]+$/)) {
      fepper.template();
    }
    else {
      utils.warn('No templates_dir defined.');
    }
    cb();
  });
})();
