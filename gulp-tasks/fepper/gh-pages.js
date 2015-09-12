var conf = JSON.parse(process.env.CONF);
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('gh-pages', function () {
  return gulp.src('./' + conf.gh_pages_src + '/**/*')
    .pipe(plugins.ghPages({
      cacheDir: './' + conf.gh_pages_dest
    }));
});
