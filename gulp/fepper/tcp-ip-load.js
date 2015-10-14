(function () {
  'use strict';

  var fs = require('fs-extra');

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  var port = conf.express_port;
  var host = 'http://localhost:' + port;
  var TcpIp = require('../../core/tcp-ip/tcp-ip.js');

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
    cb();
  });
})();
