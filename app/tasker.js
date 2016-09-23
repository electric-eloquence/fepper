/**
 * Primary gulpfile for running this application's tasks.
 *
 * The tasks listed here are for general use by developers and non-developers.
 */
'use strict';

const glob = require('glob');
const gulp = require('gulp');
const path = require('path');
const requireDir = require('require-dir');
const runSequence = require('run-sequence');

// Set global.conf, global.pref, global.rootDir, and global.workDir.
global.appDir = __dirname;
global.rootDir = path.normalize(__dirname + '/..');
global.workDir = global.rootDir;

const utils = require('./core/lib/utils');
utils.conf();
utils.pref();

// Require tasks in task directories.
requireDir('./tasker');
requireDir('../extend/auxiliary');
require('../extend/contrib');
require('../extend/custom');

// Search for extension tasks and require them.
var extendPlugins = glob.sync('../extend/*/*/*~extend.js');
for (var i = 0; i < extendPlugins.length; i++) {
  require('./' + extendPlugins[i]);
}

// Main tasks.
gulp.task('default', function (cb) {
  runSequence(
    'once',
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
    'patternlab:build',
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
    ['contrib:data:preprocess', 'custom:data:preprocess'],
    ['fepper:data', 'fepper:pattern-override'],
    ['contrib:data', 'custom:data'],
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
    'static',
    'once',
    'fepper:publish',
    // Since GitHub pages will only render the last publish, you might need to
    // ensure that only one publish task runs. The main fepper:publish task
    // can be disabled by unsetting the gh_pages_src setting in pref.yml.
    ['contrib:publish', 'custom:publish'],
    cb
  );
});

gulp.task('publish:ui', function (cb) {
  runSequence(
    ['contrib:publish:preprocess', 'custom:publish:preprocess'],
    'once',
    'fepper:publish:ui',
    // Since GitHub pages will only render the last publish, you might need to
    // ensure that only one publish task runs. The main fepper:publish task
    // can be disabled by unsetting the gh_pages_src setting in pref.yml.
    ['contrib:publish', 'custom:publish'],
    cb
  );
});

gulp.task('restart', function (cb) {
  runSequence(
    'once',
    'fepper:pattern-override',
    'tcp-ip-load:init',
    // TCP-IP overrides need to run after tcp-ip-load:init in order for there
    // to be a global.express object to override. They must then override it
    // before it starts listening and tcp-ip-reload starts watching.
    ['contrib:tcp-ip', 'custom:tcp-ip'],
    ['tcp-ip-load:listen', 'tcp-ip-reload:listen'],
    ['contrib:watch', 'custom:watch', 'tcp-ip-reload:watch'],
    // Probably no use-case for these contrib and custom postprocess tasks,
    // but here just in case.
    ['contrib:tcp-ip:postprocess', 'custom:tcp-ip:postprocess'],
    cb
  );
});

gulp.task('static', function (cb) {
  runSequence(
    ['contrib:static:preprocess', 'custom:static:preprocess'],
//    'lint',
    'minify',
    'fepper:static-generate',
    ['contrib:static', 'custom:static'],
    cb
  );
});

gulp.task('syncback', function (cb) {
  runSequence(
    ['contrib:syncback:preprocess', 'custom:syncback:preprocess'],
//    'lint',
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
    'test:eslint-extend',
    'test:eslint-fepper',
    'test:eslint-tasker',
    'test:eslint-root',
    'test:eslint-test',
    'test:mocha',
    cb
  );
});
