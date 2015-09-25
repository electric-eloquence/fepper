var conf = global.conf;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('express', function () {
  process.env.PORT = conf.express_port ? conf.express_port : 3000;
  var server = plugins.liveServer('fepper/server/server.js', null, false);
  server.start();
});
