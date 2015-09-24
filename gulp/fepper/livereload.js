var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('livereload:assets', function () {
  return gulp.src('public/!(css|patterns|styleguide)/**')
    .pipe(plugins.livereload());
});

gulp.task('livereload:index', function () {
  return gulp.src('public/index.html')
    .pipe(plugins.livereload());
});

gulp.task('livereload:inject', function () {
  return gulp.src('public/**/*.css')
    .pipe(plugins.livereload());
});
