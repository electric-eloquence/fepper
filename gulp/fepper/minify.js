(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  gulp.task('minify:uglify', function () {
    return gulp.src(conf.src + '/js/src/**/*.js')
      .pipe(plugins.uglify())
      .pipe(plugins.rename({extname: '.min.js'}))
      .pipe(gulp.dest(conf.src + '/js/min'));
  });
})();
