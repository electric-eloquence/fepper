/**
 * Primary gulpfile for running this application's tasks.
 *
 * The tasks listed here are for general use by developers and non-developers.
 */
(function () {
  'use strict';

  var gulp = require('gulp');
  var requireDir = require('require-dir');
  var runSequence = require('run-sequence');

  var utils = require('./core/lib/utils');
  // Set global.conf and process.env.CONF.
  utils.conf();

  // Load tasks in tasks directory.
  requireDir('gulp', {recurse: true});

  gulp.task('default', function (cb) {
    runSequence(
      'once',
      'data',
      'fepper:pattern-override',
      ['contrib:tcp-ip', 'custom:tcp-ip'],
      'tcp-ip-load:init',
      ['tcp-ip-load:listen', 'tcp-ip-reload:listen'],
      ['contrib:watch', 'custom:watch', 'tcp-ip-load:open', 'tcp-ip-reload:watch'],
      cb
    );
  });

  gulp.task('data', function (cb) {
    runSequence(
      ['contrib:data', 'custom:data'],
      'fepper:data',
      cb
    );
  });

  gulp.task('frontend-copy', [
    'contrib:frontend-copy',
    'custom:frontend-copy',
    'fepper:copy-assets',
    'fepper:copy-scripts',
    'fepper:copy-styles'
  ]);

  gulp.task('install', function (cb) {
    runSequence(
      'install:copy',
      'install:config',
      'data',
      cb
    );
  });

  gulp.task('lint', [
    'contrib:lint',
    'custom:lint',
    'lint:htmlhint',
    'lint:htmllint',
    'lint:eslint',
    'lint:jsonlint'
  ]);

  gulp.task('minify', [
    'contrib:minify',
    'custom:minify',
    'minify:uglify'
  ]);

  gulp.task('once', function (cb) {
    runSequence(
      ['contrib:once', 'custom:once'],
      'fepper:pattern-override',
      'patternlab:clean',
      'patternlab:build',
      'patternlab:copy',
      'patternlab:copy-styles',
      cb
    );
  });

  gulp.task('publish', function (cb) {
    runSequence(
      ['contrib:publish', 'custom:publish'],
      'fepper:publish',
      cb
    );
  });

  gulp.task('static', function (cb) {
    runSequence(
      ['contrib:static', 'custom:static'],
      'lint',
      'minify',
      'fepper:static-generate',
      cb
    );
  });

  gulp.task('syncback', function (cb) {
    runSequence(
      ['contrib:syncback', 'custom:syncback'],
      'lint',
      'minify',
      'frontend-copy',
      'template',
      cb
    );
  });

  gulp.task('template', function (cb) {
    runSequence(
      ['contrib:template', 'custom:template'],
      'fepper:template',
      cb
    );
  });

  gulp.task('test', function (cb) {
    runSequence(
      'test:eslint-fepper',
      'test:eslint-gulp',
      'test:eslint-root',
      'test:eslint-test',
      'test:mocha',
      cb
    );
  });
})();
