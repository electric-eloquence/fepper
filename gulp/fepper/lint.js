(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  gulp.task('lint:htmlhint', function () {
    return gulp.src(conf.pub + '/patterns/*/!(index|*escaped).html')
      .pipe(plugins.htmlhint('.htmlhintrc'))
      .pipe(plugins.htmlhint.reporter());
  });

  gulp.task('lint:htmllint', function () {
    return gulp.src(conf.pub + '/patterns/*/!(index|*escaped).html')
      .pipe(plugins.htmllint());
  });

  gulp.task('lint:eslint', function () {
    return gulp.src(conf.src + '/scripts/src/**/*.js')
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
  });

  gulp.task('lint:jsonlint', function () {
    return gulp.src([conf.src + '/_data/**/*.json', conf.src + '/_patterns/**/*.json'])
      .pipe(plugins.jsonlint())
      .pipe(plugins.jsonlint.reporter());
  });
}
)();
