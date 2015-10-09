(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  var Servers = require('../../fepper/servers/servers.js');

  gulp.task('express', function () {
    if (!conf) {
      return;
    }

    var app = Servers.express();
    app.listen(conf.express_port);
  });

  gulp.task('livereload', function () {
    if (!conf) {
      return;
    }

    plugins.livereload.listen();
  });
})();
