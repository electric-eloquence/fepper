(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');

  var utils = require('../core/lib/utils');
  var rootDir = utils.rootDir();
  var Tasks = require('../core/tasks/tasks');
  var tasks = new Tasks(rootDir, conf);
  var TcpIp = require('../core/tcp-ip/tcp-ip');

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
