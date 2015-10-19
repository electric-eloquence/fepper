(function () {
  'use strict';

  var conf = global.conf;
  var fs = require('fs-extra');
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  var port = conf.express_port;
  var host = 'http://localhost:' + port;
  var utils = require('../../core/lib/utils');
  var rootDir = utils.rootDir();
  var Tasks = require('../../core/tasks/tasks');
  var tasks = new Tasks(rootDir, conf);
  var TcpIp = require('../../core/tcp-ip/tcp-ip');

  function open(time, path) {
    path = path ? path : '';
    var options = {uri: host + path};

    return gulp.src('', {read: false})
      .pipe(plugins.wait(time))
      .pipe(plugins.open(options));
  }

  gulp.task('tcp-ip-load:init', function (cb) {
    global.express = TcpIp.express();
    cb();
  });

  gulp.task('tcp-ip-load:listen', function () {
    if (!conf) {
      return;
    }
    global.express.listen(conf.express_port);
  });

  gulp.task('tcp-ip-load:open', function (cb) {
    tasks.open();
    cb();
  });
})();
