/**
 * Separating auxiliary custom tasks into this file to reduce the amount of 
 * noise in custom.js. Preprocess means the task will run before the core Fepper 
 * task. Postprocess means it will run after.
 */
(function () {
  'use strict';

  var gulp = require('gulp');

  gulp.task('custom:data:preprocess', [
  ]);

  gulp.task('custom:frontend-copy:preprocess', [
  ]);

  // Probably no use-case for preprocessing lint tasks, but here just in case.
  gulp.task('custom:lint:preprocess', [
  ]);

  gulp.task('custom:minify:preprocess', [
  ]);

  gulp.task('custom:once:preprocess', [
  ]);

  gulp.task('custom:publish:preprocess', [
  ]);

  gulp.task('custom:static:preprocess', [
  ]);

  gulp.task('custom:syncback:preprocess', [
  ]);

  // TCP-IP overrides should run before tcp-ip-load:init in order to override
  // TcpIp objects before they start listening and watching.
  // Therefore, the auxiliary task option is for postprocess and not preprocess.
  gulp.task('custom:tcp-ip:postprocess', [
  ]);

  gulp.task('custom:template:preprocess', [
  ]);
})();
