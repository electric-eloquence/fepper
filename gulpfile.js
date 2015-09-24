/**
 * Primary gulpfile for running this application's tasks.
 *
 * The tasks listed here are for general use by developers and non-developers.
 */
var gulp = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');

var utils = require('./fepper/lib/utils');
var conf = utils.conf();

// Load tasks in tasks directory.
requireDir('gulp', {recurse: true});

gulp.task('default', function () {
  runSequence(
    ['shell:node-kill'],
    ['once'],
    ['data'],
    ['fepper:cd-in'],
    ['fepper:pattern-override'],
    ['fepper:cd-out'],
    ['express'],
    ['patternlab:cd-in'],
    ['patternlab:watch', 'contrib', 'custom', 'open']
  );
});

gulp.task('data', function () {
  runSequence(
    ['fepper:cd-in'],
    ['fepper:appendix'],
    ['fepper:json-compile'],
    ['fepper:cd-out']
  );
});

gulp.task('frontend-copy', [
  'fepper:copy-css',
  'fepper:copy-fonts',
  'fepper:copy-images',
  'fepper:copy-js',
  'fepper:copy-templates'
]);

gulp.task('install', function () {
  runSequence(
    ['shell:node-kill'],
    ['install:copy'],
    ['install:config'],
    ['data'],
    ['patternlab:cd-in'],
    ['shell:install-npm'],
    ['patternlab:cd-out'],
    ['once'],
    ['data'],
    ['fepper:cd-in'],
    ['fepper:pattern-override'],
    ['fepper:cd-out'],
    ['express'],
    ['patternlab:cd-in'],
    ['patternlab:watch', 'contrib', 'custom', 'open:install']
  );
});

gulp.task('lint', [
  'lint:htmlhint',
  'lint:htmllint',
  'lint:jshint',
  'lint:jsonlint'
]);

gulp.task('once', function () {
  runSequence(
    ['patternlab:cd-in'],
    ['patternlab:clean'],
    ['patternlab:build', 'patternlab:copy', 'css-process'],
    ['patternlab:cd-out']
  );
});

gulp.task('publish', function () {
  runSequence(
    ['fepper:cd-in'],
    ['fepper:gh-pages'],
    ['fepper:cd-out'],
    ['gh-pages']
  );
});

gulp.task('static', function () {
  runSequence(
    ['fepper:cd-in'],
    ['fepper:static-generate'],
    ['fepper:cd-out']
  );
});

gulp.task('syncback', function () {
  runSequence(
    ['lint'],
    ['uglify'],
    ['frontend-copy']
  );
});

gulp.task('test', [
  'mocha'
]);
