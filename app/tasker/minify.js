'use strict';

const srcDir = global.conf.ui.paths.source;

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const utils = require('../core/lib/utils');

gulp.task('minify:uglify', function () {
  return gulp.src(utils.pathResolve(srcDir.js) + '/src/**/*.js')
    .pipe(plugins.uglify())
    .pipe(plugins.rename({extname: '.min.js'}))
    .pipe(gulp.dest(utils.pathResolve(srcDir.js) + '/min'));
});
