var conf = global.conf;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var port = conf.express_port ? conf.express_port : 9001;
var host = 'http://localhost:' + port;

function open(time, path) {
  path = path ? path : '';
  var options = {uri: host + path};

  return gulp.src('', {read: false})
    .pipe(plugins.wait(time))
    .pipe(plugins.open(options));
}

gulp.task('open', function () {
  return open(conf.timeout_main);
});

gulp.task('open:install', function () {
  return open(conf.timeout_main * 2, '/success');
});
