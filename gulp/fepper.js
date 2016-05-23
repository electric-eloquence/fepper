'use strict';

var conf = global.conf;
var pref = global.pref;
var gulp = require('gulp');

var utils = require('../core/lib/utils');
var rootDir = utils.rootDir();

var pathIn = rootDir + '/core/tasks';
var pathOut = rootDir;
var Tasks = require('../core/tasks/tasks');
var tasks = new Tasks(rootDir, conf, pref);

gulp.task('fepper:copy-assets', function () {
  if (typeof pref.backend.synced_dirs.assets_dir === 'string' && pref.backend.synced_dirs.assets_dir.trim()) {
    return gulp.src(rootDir + '/' + conf.src + '/assets/**')
      .pipe(gulp.dest('backend/' + pref.backend.synced_dirs.assets_dir));
  }
});

gulp.task('fepper:copy-scripts', function () {
  if (typeof pref.backend.synced_dirs.scripts_dir === 'string' && pref.backend.synced_dirs.scripts_dir.trim()) {
    return gulp.src(rootDir + '/' + conf.src + '/scripts/*/**')
      .pipe(gulp.dest('backend/' + pref.backend.synced_dirs.scripts_dir));
  }
});

gulp.task('fepper:copy-styles', function () {
  if (typeof pref.backend.synced_dirs.styles_dir === 'string' && pref.backend.synced_dirs.styles_dir.trim()) {
    return gulp.src(rootDir + '/' + conf.src + '/styles/**')
      .pipe(gulp.dest('backend/' + pref.backend.synced_dirs.styles_dir));
  }
});

gulp.task('fepper:data', function (cb) {
  var p1 = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    tasks.appendix();
    resolve();
  });
  p1.then(function () {
    p2();
  })
  .catch(function (reason) {
    utils.error(reason);
    cb();
  });

  var p2 = function () {
    var p = new Promise(function (resolve, reject) {
      tasks.jsonCompile();
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
      cb();
    });
  };
});

gulp.task('fepper:pattern-override', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    tasks.patternOverride(rootDir + '/' + conf.pub + '/scripts/pattern-overrider.js');
    resolve();
  });
  p.then(function () {
    process.chdir(pathOut);
    cb();
  })
  .catch(function (reason) {
    utils.error(reason);
    cb();
  });
});

gulp.task('fepper:publish', function (cb) {
  if (typeof pref.gh_pages_src === 'string' && pref.gh_pages_src.trim()) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      tasks.publish(rootDir + '/.publish', pref);
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
      cb();
    });
  }
  else {
    utils.error('gh_pages_src not set.');
  }
});

gulp.task('fepper:static-generate', function (cb) {
  var p = new Promise(function (resolve, reject) {
    process.chdir(pathIn);
    tasks.staticGenerate();
    resolve();
  });
  p.then(function () {
    process.chdir(pathOut);
    cb();
  })
  .catch(function (reason) {
    utils.error(reason);
    cb();
  });
});

gulp.task('fepper:template', function (cb) {
  if (typeof pref.backend.synced_dirs.templates_dir === 'string' && pref.backend.synced_dirs.templates_dir.trim()) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      tasks.template();
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      utils.error(reason);
      cb();
    });
  }
  else {
    utils.warn('No templates_dir defined.');
  }
});
