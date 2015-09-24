var conf = JSON.parse(process.env.CONF);
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('express', function () {
  process.env.PORT = conf.express_port ? conf.express_port : 9001;
  var server = plugins.liveServer.new('fepper/server/server.js');
  server.start();
});
