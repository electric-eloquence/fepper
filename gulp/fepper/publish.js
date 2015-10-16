(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  var utils = require('../../core/lib/utils.js');

  gulp.task('publish:gh-pages', function () {
    if (typeof conf.gh_pages_src === 'string' && conf.gh_pages_src.trim() &&
        typeof conf.gh_pages_dest === 'string' && conf.gh_pages_dest.trim()
    ) {
      return gulp.src('./' + conf.gh_pages_src + '/**/*')
        .pipe(plugins.ghPages({
          cacheDir: './' + conf.gh_pages_dest
        }));
    }
    else if (typeof conf.gh_pages_dest !== 'string' || !conf.gh_pages_dest.trim()) {
      // "gh_pages_src not set" error thrown in task fepper:gh-pages.
      utils.error('gh_pages_dest not set.');
    }
  });
})();
