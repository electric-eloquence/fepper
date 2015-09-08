var conf = JSON.parse(process.env.CONF);
var gulp = require('gulp');
var server = require('gulp-express');

gulp.task('express', function () {
  process.env.PORT = conf.express_port ? conf.express_port : 9001;
  server.run(['fepper/server/server.js'], {}, false);
});
