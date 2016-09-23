'use strict';

const srcDir = global.conf.ui.paths.source;

const fs = require('fs-extra');
const gulp = require('gulp');

const utils = require('../core/lib/utils');

gulp.task('install:copy', function (cb) {
  try {
    fs.statSync(utils.pathResolve(srcDir.root));
  }
  catch (err) {
    // Only copy app/excludes/profiles/main/source if ui/source doesn't
    // exist.
    if (err.code === 'ENOENT') {
      return gulp.src('./excludes/profiles/main/source/**')
        .pipe(gulp.dest(utils.pathResolve(srcDir.root)));
    }
  }
  cb();
});
