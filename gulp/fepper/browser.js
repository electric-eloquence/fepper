(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();
  var port = conf.express_port ? conf.express_port : 3000;
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
    return open(conf.timeout_main);
  });

  gulp.task('open:install', function () {
    return open(conf.timeout_main * 2, '/success');
  });
})();
