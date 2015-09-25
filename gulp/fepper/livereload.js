var conf = global.conf;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('livereload:assets', function () {
  return gulp.src(conf.pub + '/!(css|patterns|styleguide)/**')
    .pipe(plugins.livereload());
});

gulp.task('livereload:index', function () {
  return gulp.src(conf.pub + '/index.html')
    .pipe(plugins.livereload());
});

gulp.task('livereload:inject', function () {
  return gulp.src(conf.pub + '/**/*.css')
    .pipe(plugins.livereload());
});
