(function () {
  'use strict';

  var fs = require('fs-extra');

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();
  var port = conf.express_port;
  var host = 'http://localhost:' + port;

  function open(time, path) {
    path = path ? path : '';
    var options = {uri: host + path};

    return gulp.src('', {read: false})
      .pipe(plugins.wait(time))
      .pipe(plugins.open(options));
  }

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

  gulp.task('open', function () {
    var log = './install.log';
    var stats;

    try {
      stats = fs.statSync(log);
    }
    catch (err) {
      // Fail gracefully.
    }
    if (stats && stats.isFile()) {
      setTimeout(function () {
        fs.unlink(log);
        return open(0, '/success');
      }, conf.timeout_main * 2);
    }
    else {
      return open(conf.timeout_main);
    }
  });
})();
