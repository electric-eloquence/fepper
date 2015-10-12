(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');
  var plugins = require('gulp-load-plugins')();

  var port = conf.express_port;
  var host = 'http://localhost:' + port;
  var TcpIp = require('../../fepper/tcp-ip/tcp-ip.js');

  function open(time, path) {
    path = path ? path : '';
    var options = {uri: host + path};

    return gulp.src('', {read: false})
      .pipe(plugins.wait(time))
      .pipe(plugins.open(options));
  }

  gulp.task('tcp-ip-load:init', function () {
    global.express = TcpIp.express();
  });

  gulp.task('tcp-ip-load:listen', function () {
    if (!conf) {
      return;
    }

    var app = global.express;
    app.listen(conf.express_port);
  });

  gulp.task('tcp-ip-load:open', function () {
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
