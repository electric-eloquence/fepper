/**
 * Primary gulpfile for running this application's tasks.
 *
 * The tasks listed here are for general use by developers and non-developers.
 */
'use strict';

var glob = require('glob');
var gulp = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');

var utils = require('./core/lib/utils');
// Set global.conf, process.env.CONF, and global.pref.
utils.conf();
utils.pref();

// Require tasks in task directories.
requireDir('./gulp');
requireDir('./extend/auxiliary');
require('./extend/contrib');
require('./extend/custom');
var extendPlugins = glob.sync('extend/**/*_extend.js');
for (var i = 0; i < extendPlugins.length; i++) {
  require('./' + extendPlugins[i]);
}

gulp.task('default', function (cb) {
  runSequence(
    'once',
    'data',
    'fepper:pattern-override',
    'tcp-ip-load:init',
    // TCP-IP overrides need to run after tcp-ip-load:init in order for there
    // to be a global.express object to override. They must then override it
    // before it starts listening and tcp-ip-reload starts watching.
    ['contrib:tcp-ip', 'custom:tcp-ip'],
    ['tcp-ip-load:listen', 'tcp-ip-reload:listen'],
    ['contrib:watch', 'custom:watch', 'tcp-ip-load:open', 'tcp-ip-reload:watch'],
    // Probably no use-case for these contrib and custom postprocess tasks,
    // but here just in case.
    ['contrib:tcp-ip:postprocess', 'custom:tcp-ip:postprocess'],
    cb
  );
});

gulp.task('data', function (cb) {
  runSequence(
    ['contrib:data:preprocess', 'custom:data:preprocess'],
    'fepper:data',
    ['contrib:data', 'custom:data'],
    cb
  );
});

gulp.task('frontend-copy', [
  'contrib:frontend-copy:preprocess',
  'custom:frontend-copy:preprocess',
  'fepper:copy-assets',
  'fepper:copy-scripts',
  'fepper:copy-styles',
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
  // Probably no use-case for these contrib and custom preprocess tasks,
  // but here just in case.
  'contrib:lint:preprocess',
  'custom:lint:preprocess',
  'lint:htmlhint',
  'lint:htmllint',
  'lint:eslint',
  'lint:jsonlint',
  'contrib:lint',
  'custom:lint'
]);

gulp.task('minify', [
  'contrib:minify:preprocess',
  'custom:minify:preprocess',
  'minify:uglify',
  'contrib:minify',
  'custom:minify'
]);

gulp.task('once', function (cb) {
  runSequence(
    ['contrib:once:preprocess', 'custom:once:preprocess'],
    'fepper:pattern-override',
    'patternlab:clean',
    'patternlab:build',
    'patternlab:copy',
    'patternlab:copy-styles',
    ['contrib:once', 'custom:once'],
    cb
  );
});

gulp.task('publish', function (cb) {
  runSequence(
    ['contrib:publish:preprocess', 'custom:publish:preprocess'],
    'fepper:publish',
    // Since GitHub pages will only render the last publish, you might need to
    // ensure that only one publish task runs. The main fepper:publish task
    // can be disabled by unsetting the gh_pages_src setting in pref.yml.
    ['contrib:publish', 'custom:publish'],
    cb
  );
});

gulp.task('static', function (cb) {
  runSequence(
    ['contrib:static:preprocess', 'custom:static:preprocess'],
    'lint',
    'minify',
    'fepper:static-generate',
    ['contrib:static', 'custom:static'],
    cb
  );
});

gulp.task('syncback', function (cb) {
  runSequence(
    ['contrib:syncback:preprocess', 'custom:syncback:preprocess'],
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
    ['contrib:template:preprocess', 'custom:template:preprocess'],
    'fepper:template',
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
