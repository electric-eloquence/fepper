'use strict';

var conf = global.conf;
var fs = require('fs-extra');
var gulp = require('gulp');

gulp.task('install:config', function () {
  try {
    fs.statSync(conf.pln + '/patternlab-config.json');
  }
  catch (err) {
    // Only copy to patternlab-config.json if it doesn't exist.
    if (err.code === 'ENOENT') {
      return gulp.src('./excludes/patternlab-config.json')
        .pipe(gulp.dest('./' + conf.pln));
    }
  }
});

gulp.task('install:copy', function () {
  try {
    fs.statSync(conf.src);
  }
  catch (err) {
    // Only copy excludes/source if patternlab-node/source doesn't exist.
    if (err.code === 'ENOENT') {
      return gulp.src('./excludes/source/**')
        .pipe(gulp.dest('./' + conf.src));
    }
  }
});
