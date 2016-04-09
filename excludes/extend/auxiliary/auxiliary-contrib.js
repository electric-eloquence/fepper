/**
 * Separating auxiliary contrib tasks into this file to reduce the amount of 
 * noise in contrib.js. Preprocess means the task will run before the core 
 * Fepper task. Postprocess means it will run after.
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
// Uncomment if you're enabling multisite.
//    'multisite:patternlab-override'
  ]);

  gulp.task('contrib:publish:preprocess', [
  ]);

  gulp.task('contrib:static:preprocess', [
  ]);

  gulp.task('contrib:syncback:preprocess', [
  ]);

  // TCP-IP overrides need to run after tcp-ip-load:init in order for there to
  // be a global.express object to override. They must then override it before
  // it starts listening and tcp-ip-reload starts watching. Hence, the default
  // contrib task is a preprocess and this auxiliary task is a postprocess.
  gulp.task('contrib:tcp-ip:postprocess', [
  ]);

  gulp.task('contrib:template:preprocess', [
  ]);
})();
