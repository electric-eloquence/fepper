'use strict';

const conf = global.conf;

const gulp = require('gulp');

const Tasks = require('../core/tasks/tasks');
const TcpIp = require('../core/tcp-ip/tcp-ip');

var tasks = new Tasks();

gulp.task('tcp-ip-load:init', function (cb) {
  global.express = TcpIp.express();
  cb();
});

gulp.task('tcp-ip-load:listen', function () {
  global.express.listen(conf.express_port);
});

gulp.task('tcp-ip-load:open', function (cb) {
  tasks.open();
  cb();
});
