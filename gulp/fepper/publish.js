(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  gulp.task('publish:gh-pages', function () {
    return gulp.src('./' + conf.gh_pages_src + '/**/*')
      .pipe(plugins.ghPages({
        cacheDir: './' + conf.gh_pages_dest
      }));
  });
})();
