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

  var utils = require('./fepper/lib/utils');
  // Set global.conf and process.env.CONF.
  utils.conf();

  // Load tasks in tasks directory.
  requireDir('gulp', {recurse: true});

  gulp.task('default', function (cb) {
    runSequence(
      'once',
      'data',
      'fepper:cd-in',
      'fepper:pattern-override',
      'fepper:cd-out',
      ['express', 'livereload'],
      ['contrib:watch', 'custom:watch', 'open', 'patternlab:watch'],
      cb
    );
  });

  gulp.task('data', function (cb) {
    runSequence(
      'fepper:data',
      ['contrib:data', 'custom:data'],
      cb
    );
  });

  gulp.task('frontend-copy', [
    'fepper:copy-css',
    'fepper:copy-fonts',
    'fepper:copy-images',
    'fepper:copy-js',
    'contrib:frontend-copy',
    'custom:frontend-copy'
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
    'lint:htmlhint',
    'lint:htmllint',
    'lint:eslint',
    'lint:jsonlint',
    'contrib:lint',
    'custom:lint'
  ]);

  gulp.task('minify', [
    'uglify',
    'contrib:minify',
    'custom:minify'
  ]);

  gulp.task('once', function (cb) {
    runSequence(
      'patternlab:clean',
      ['patternlab:build', 'patternlab:copy'],
      ['contrib:once', 'custom:once'],
      cb
    );
  });

  gulp.task('publish', function (cb) {
    runSequence(
      'fepper:cd-in',
      'fepper:gh-pages',
      'fepper:cd-out',
//      'gh-pages',
      ['contrib:publish', 'custom:publish'],
      cb
    );
  });

  gulp.task('static', function (cb) {
    runSequence(
      'lint',
      'minify',
      'fepper:cd-in',
      'fepper:static-generate',
      'fepper:cd-out',
      ['contrib:static', 'custom:static'],
      cb
    );
  });

  gulp.task('syncback', function (cb) {
    runSequence(
      'lint',
      'minify',
      'frontend-copy',
      'template',
      ['contrib:syncback', 'custom:syncback'],
      cb
    );
  });

  gulp.task('template', function (cb) {
    runSequence(
      'fepper:cd-in',
      'fepper:template',
      'fepper:cd-out',
      ['contrib:template', 'custom:template'],
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
