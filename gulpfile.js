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
    ['once'],
    ['data'],
    ['fepper:cd-in'],
    ['fepper:pattern-override'],
    ['fepper:cd-out'],
    ['express'],
    ['contrib:watch', 'custom:watch', 'open', 'patternlab:watch']
  );
});

gulp.task('data', function () {
  runSequence(
    ['fepper:cd-in'],
    ['fepper:appendix'],
    ['fepper:json-compile'],
    ['fepper:cd-out'],
    ['contrib:data', 'custom:data']
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

gulp.task('install', function () {
  runSequence(
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
    ['contrib:watch', 'custom:watch', 'open:install', 'patternlab:watch']
  );
});

gulp.task('lint', [
  'lint:htmlhint',
  'lint:htmllint',
  'lint:jshint',
  'lint:jsonlint',
  'contrib:lint',
  'custom:lint'
]);

gulp.task('minify', [
  'uglify',
  'contrib:minify',
  'custom:minify'
]);

gulp.task('once', function () {
  runSequence(
    ['patternlab:cd-in'],
    ['patternlab:clean'],
    ['patternlab:build', 'patternlab:copy'],
    ['patternlab:cd-out'],
    ['contrib:once', 'custom:once']
  );
});

gulp.task('publish', function () {
  runSequence(
    ['fepper:cd-in'],
    ['fepper:gh-pages'],
    ['fepper:cd-out'],
    ['gh-pages'],
    ['contrib:publish', 'custom:publish']
  );
});

gulp.task('static', function () {
  runSequence(
    ['fepper:cd-in'],
    ['fepper:static-generate'],
    ['fepper:cd-out'],
    ['contrib:static', 'custom:static']
  );
});

gulp.task('syncback', function () {
  runSequence(
    ['lint'],
    ['uglify'],
    ['frontend-copy'],
    ['templater'],
    ['contrib:syncback', 'custom:syncback']
  );
});

gulp.task('template', function () {
  runSequence(
    ['fepper:cd-in'],
    ['fepper:template'],
    ['fepper:cd-out'],
    ['contrib:template', 'custom:template']
  );
});

gulp.task('test', [
  'mocha'
]);
