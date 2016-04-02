(function () {
  'use strict';

  var conf = global.conf;
  var fs = require('fs-extra');
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  gulp.task('install:config', function () {
    try {
      fs.statSync(conf.pln + '/patternlab-config.json');
    }
    catch (err) {
      // Only copy to patternlab-config.json if it doesn't exist.
      if (err.code === 'ENOENT') {
        return gulp.src('./patternlab-config.json')
          .pipe(gulp.dest('./' + conf.pln));
      }
    }
  });

  gulp.task('install:copy', function () {
    try {
      fs.statSync(conf.src);
    }
    catch (err) {
      // Only copy _source if patternlab-config.json doesn't exist.
      if (err.code === 'ENOENT') {
        return gulp.src('./_source/**')
          .pipe(gulp.dest('./' + conf.pln + '/source/'));
      }
    }
  });
}
)();
