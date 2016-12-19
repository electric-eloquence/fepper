/**
 * Primary gulpfile for running this application's tasks.
 *
 * The tasks listed here are for general use by developers and non-developers.
 */
'use strict';

const fs = require('fs-extra');
const glob = require('glob');
const gulp = require('gulp');
const path = require('path');
const requireDir = require('require-dir');
const runSequence = require('run-sequence');

const utils = require('./core/lib/utils');

// Set global.conf, global.pref, global.rootDir, and global.workDir.
global.appDir = __dirname;
global.rootDir = utils.findup('fepper.command', __dirname);
global.workDir = global.rootDir;

utils.conf();
utils.pref();

// Require tasks in task directories.
requireDir('./tasker');

// Optionally require auxiliary, contrib, and custom tasks.
const auxDir = '../extend/auxiliary';
const conFile = '../extend/contrib.js';
const cusFile = '../extend/custom.js';
const auxExists = fs.existsSync(auxDir);
const conExists = fs.existsSync(conFile);
const cusExists = fs.existsSync(cusFile);
if (auxExists) {
  requireDir(auxDir);
}
if (conExists) {
  require(conFile);
}
if (cusExists) {
  require(cusFile);
}

// Search for extension tasks and require them.
var extendPlugins = glob.sync('../extend/*/*/*~extend.js');
for (var i = 0; i < extendPlugins.length; i++) {
  require('./' + extendPlugins[i]);
}

// Main tasks.
gulp.task('default', function (cb) {
  let args = [];

  args.push('once');
  args.push('fepper:pattern-override');
  args.push('tcp-ip-load:init');

  if (conExists && cusExists) {
    // TCP-IP overrides need to run after tcp-ip-load:init in order for there to be a global.express object to override. 
    // They must then override it before it starts listening and tcp-ip-reload starts watching.
    args.push(['contrib:tcp-ip', 'custom:tcp-ip']);
  }

  args.push(['tcp-ip-load:listen', 'tcp-ip-reload:listen']);

  if (conExists && cusExists) {
    args.push(['contrib:watch', 'custom:watch', 'tcp-ip-load:open', 'tcp-ip-reload:watch']);
    // Probably no use-case for these contrib and custom postprocess tasks, but here just in case.
    args.push(['contrib:tcp-ip:postprocess', 'custom:tcp-ip:postprocess']);
  }
  else {
    args.push(['tcp-ip-load:open', 'tcp-ip-reload:watch']);
  }

  args.push(cb);

  runSequence.apply(null, args);
});

gulp.task('data', function (cb) {
  let args = [];

  if (conExists && cusExists) {
    args.push(['contrib:data:preprocess', 'custom:data:preprocess']);
  }

  args.push('fepper:data');
  args.push('patternlab:build');

  if (conExists && cusExists) {
    args.push(['contrib:data', 'custom:data']);
  }

  args.push(cb);

  runSequence.apply(null, args);
});

gulp.task('frontend-copy', function (cb) {
  let args = [];

  if (conExists && cusExists) {
    args.push(['contrib:frontend-copy:preprocess', 'custom:frontend-copy:preprocess']);
  }

  args.push(['fepper:copy-assets', 'fepper:copy-scripts', 'fepper:copy-styles']);

  if (conExists && cusExists) {
    args.push(['contrib:frontend-copy', 'custom:frontend-copy']);
  }

  args.push(cb);

  runSequence.apply(null, args);
});

gulp.task('install', function (cb) {
  runSequence(
    'install:copy',
    'fepper:data',
    cb
  );
});

gulp.task('once', function (cb) {
  let args = [];

  if (conExists && cusExists) {
    args.push(['contrib:once:preprocess', 'custom:once:preprocess']);
    args.push(['contrib:data:preprocess', 'custom:data:preprocess']);
  }

  args.push(['fepper:data', 'fepper:pattern-override']);

  if (conExists && cusExists) {
    args.push(['contrib:data', 'custom:data']);
  }

  args.push('patternlab:clean');
  args.push('patternlab:build');
  args.push('patternlab:copy');
  args.push('patternlab:copy-styles');

  if (conExists && cusExists) {
    args.push(['contrib:once', 'custom:once']);
  }

  args.push(cb);

  runSequence.apply(null, args);
});

gulp.task('restart', function (cb) {
  let args = [];

  args.push('once');
  args.push('fepper:pattern-override');
  args.push('tcp-ip-load:init');

  if (conExists && cusExists) {
    // TCP-IP overrides need to run after tcp-ip-load:init in order for there to be a global.express object to override. 
    // They must then override it before it starts listening and tcp-ip-reload starts watching.
    args.push(['contrib:tcp-ip', 'custom:tcp-ip']);
  }

  args.push(['tcp-ip-load:listen', 'tcp-ip-reload:listen']);

  if (conExists && cusExists) {
    args.push(['contrib:watch', 'custom:watch', 'tcp-ip-reload:watch']);
    // Probably no use-case for these contrib and custom postprocess tasks, but here just in case.
    args.push(['contrib:tcp-ip:postprocess', 'custom:tcp-ip:postprocess']);
  }
  else {
    args.push('tcp-ip-reload:watch');
  }

  args.push(cb);

  runSequence.apply(null, args);
});

gulp.task('static', function (cb) {
  let args = [];

  if (conExists && cusExists) {
    args.push(['contrib:static:preprocess', 'custom:static:preprocess']);
  }

  args.push('once');
  args.push('fepper:static-generate');

  if (conExists && cusExists) {
    args.push(['contrib:static', 'custom:static']);
  }

  args.push(cb);

  runSequence.apply(null, args);
});

gulp.task('syncback', function (cb) {
  let args = [];

  if (conExists && cusExists) {
    args.push(['contrib:syncback:preprocess', 'custom:syncback:preprocess']);
  }

  args.push('frontend-copy');
  args.push('template');

  if (conExists && cusExists) {
    args.push(['contrib:syncback', 'custom:syncback']);
  }

  args.push(cb);

  runSequence.apply(null, args);
});

gulp.task('template', function (cb) {
  let args = [];

  if (conExists && cusExists) {
    args.push(['contrib:template:preprocess', 'custom:template:preprocess']);
  }

  args.push('fepper:template');

  if (conExists && cusExists) {
    args.push(['contrib:template', 'custom:template']);
  }

  args.push(cb);

  runSequence.apply(null, args);
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
