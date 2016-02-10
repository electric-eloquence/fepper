/**
 * Put Gulp tasks contributed by the community in this directory and add them to
 * the more general tasks listed below.
 */
(function () {
  'use strict';

  var gulp = require('gulp');

  gulp.task('contrib:data:preprocess', [
  ]);

  gulp.task('contrib:frontend-copy:preprocess', [
  ]);

  // Probably no use-case for preprocessing lint tasks, but here just in case.
  gulp.task('contrib:lint:preprocess', [
  ]);

  gulp.task('contrib:minify:preprocess', [
  ]);

  gulp.task('contrib:once:preprocess', [
  ]);

  gulp.task('contrib:publish:preprocess', [
  ]);

  gulp.task('contrib:static:preprocess', [
  ]);

  gulp.task('contrib:syncback:preprocess', [
  ]);

  // TCP-IP overrides should run before tcp-ip-load:init in order to override
  // TcpIp objects before they start listening and watching.
  // Therefore, the auxiliary task option is for postprocess and not preprocess.
  gulp.task('contrib:tcp-ip:postprocess', [
  ]);

  gulp.task('contrib:template:preprocess', [
  ]);
})();
