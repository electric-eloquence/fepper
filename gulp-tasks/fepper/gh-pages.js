var conf = JSON.parse(process.env.CONF);
var ghPages = require('gulp-gh-pages'); // Can't use gulp-load-plugins for some reason.
var gulp = require('gulp');

gulp.task('gh-pages', function () {
  return gulp.src('./' + conf.gh_pages_src + '/**/*')
    .pipe(ghPages({
      cacheDir: './' + conf.gh_pages_dest
    }));
});
