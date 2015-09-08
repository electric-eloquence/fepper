var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('livereload', function () {
  return gulp.src('', {read: false})
    .pipe(plugins.livereload());
});
