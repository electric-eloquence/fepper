var conf = global.conf;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('lint:htmlhint', function () {
  return gulp.src(conf.pub + '/patterns/**/*.html')
    .pipe(plugins.htmlhint())
    .pipe(plugins.htmlhint.reporter());
});

gulp.task('lint:htmllint', function () {
  return gulp.src(conf.pub + '/patterns/**/*.html')
    .pipe(plugins.htmllint());
});

gulp.task('lint:eslint', function () {
  return gulp.src(conf.src + '/js/src/**/*.js')
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('lint:jsonlint', function () {
  return gulp.src([conf.src + '/_data/**/*.json', conf.src + '/_patterns/**/*.json'])
    .pipe(plugins.jsonlint())
    .pipe(plugins.jsonlint.reporter());
});
