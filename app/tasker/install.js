/**
 * Using gulp to copy the source dir because we need to parse patternlab-config.json to know the destination.
 */
'use strict';

const srcDir = global.conf.ui.paths.source;

const fs = require('fs-extra');
const gulp = require('gulp');

const utils = require('../core/lib/utils');

gulp.task('install:copy', function (cb) {
  if (!fs.existsSync(utils.pathResolve(srcDir.root))) {
    return gulp.src('./excludes/profiles/main/source/**')
      .pipe(gulp.dest(utils.pathResolve(srcDir.root)));
  }
  cb();
});

gulp.task('install:copy-base', function (cb) {
  if (!fs.existsSync(utils.pathResolve(srcDir.root))) {
    return gulp.src('./excludes/profiles/base/source/**')
      .pipe(gulp.dest(utils.pathResolve(srcDir.root)));
  }
  cb();
});
