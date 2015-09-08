var conf = JSON.parse(process.env.CONF);
var fs = require('fs-extra');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('install:config', function () {
  try {
    var stats = fs.statSync(conf.pln + '/config.json');
  }
  catch (er) {
    // Only copy to config.json if config.json doesn't exist.
    if (er.code === 'ENOENT') {
      return gulp.src('./patternlab.config.json')
        .pipe(plugins.rename('config.json'))
        .pipe(gulp.dest('./' + conf.pln));
    }
  }
});

gulp.task('install:copy', function () {
  try {
    var stats = fs.statSync(conf.pln + '/config.json');
  }
  catch (er) {
    // Only copy _source if config.json doesn't exist.
    if (er.code === 'ENOENT') {
      return gulp.src('./_source/**/*')
        .pipe(gulp.dest('./' + conf.pln + '/source/'));
    }
  }
});
