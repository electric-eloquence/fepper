(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  gulp.task('express', function () {
    process.env.PORT = conf.express_port;
    var express = plugins.liveServer('fepper/servers/servers.js', null, false);
    express.start();
  });

  gulp.task('livereload', function () {
    plugins.livereload.listen();
  });
})();
