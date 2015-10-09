(function () {
  'use strict';

  var conf = global.conf;
  var gulp = require('gulp');

  var utils = require('../../fepper/lib/utils');
  var rootDir = utils.rootDir();
  var Tasks = require('../../fepper/tasks/tasks');
  var tasks = new Tasks(rootDir, conf);

  gulp.task('fepper:cd-in', function (cb) {
    process.chdir('fepper/tasks');
    cb();
  });

  gulp.task('fepper:cd-out', function (cb) {
    process.chdir('../..');
    cb();
  });

  gulp.task('fepper:copy-css', function () {
    if (typeof conf.backend.synced_dirs.css_dir === 'string' && conf.backend.synced_dirs.css_dir.match(/^[\w.\/-]+$/)) {
      return gulp.src(rootDir + '/' + conf.src + '/css/*')
        .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.css_dir));
    }
  });

  gulp.task('fepper:copy-fonts', function () {
    if (typeof conf.backend.synced_dirs.fonts_dir === 'string' && conf.backend.synced_dirs.fonts_dir.match(/^[\w.\/-]+$/)) {
      return gulp.src(rootDir + '/' + conf.src + '/fonts/*')
        .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.fonts_dir));
    }
  });

  gulp.task('fepper:copy-images', function () {
    if (typeof conf.backend.synced_dirs.images_dir === 'string' && conf.backend.synced_dirs.images_dir.match(/^[\w.\/-]+$/)) {
      return gulp.src(rootDir + '/' + conf.src + '/images/*')
        .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.images_dir));
    }
  });

  gulp.task('fepper:copy-js', function () {
    if (typeof conf.backend.synced_dirs.js_dir === 'string' && conf.backend.synced_dirs.js_dir.match(/^[\w.\/-]+$/)) {
      return gulp.src(rootDir + '/' + conf.src + '/js/*/**/*')
        .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.js_dir));
    }
  });

  gulp.task('fepper:data', function (cb) {
    var p1 = new Promise(function (resolve, reject) {
      process.chdir(rootDir + '/fepper/tasks');
      tasks.appendix();
      resolve();
    });
    p1.then(function () {
      f2();
    })
    .catch(function (reason) {
      utils.error(reason);
    });

    var f2 = function () {
      var p2 = new Promise(function (resolve, reject) {
        tasks.jsonCompile();
        resolve();
      });
      p2.then(function () {
        process.chdir(rootDir);
        cb();
      })
      .catch(function (reason) {
        utils.error(reason);
      });
    };
  });

  gulp.task('fepper:gh-pages', function (cb) {
    if (typeof conf.gh_pages_src === 'string' && conf.gh_pages_src.trim() !== '') {
      tasks.ghPagesPrefix();
    }
    else {
      // Quit if gh_pages_src not set.
      utils.error('gh_pages_src not set.');
    }
    cb();
  });

  gulp.task('fepper:pattern-override', function (cb) {
    tasks.patternOverride(rootDir + '/' + conf.pub + '/js/pattern-overrider.js');
    cb();
  });

  gulp.task('fepper:static-generate', function (cb) {
    tasks.staticGenerate();
    cb();
  });

  gulp.task('fepper:template', function (cb) {
    if (typeof conf.backend.synced_dirs.templates_dir === 'string' && conf.backend.synced_dirs.templates_dir.match(/^[\w.\/-]+$/)) {
      tasks.template();
    }
    else {
      utils.warn('No templates_dir defined.');
    }
    cb();
  });
})();
