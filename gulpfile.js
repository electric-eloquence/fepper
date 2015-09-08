// Write configs to global process.env object.
var enc = 'utf8';
var fs = require('fs-extra');
var yaml = require('js-yaml');
var yml = fs.readFileSync('conf.yml', enc);
var conf = yaml.safeLoad(yml);

// Apparently, process.env properties need to be strings.
process.env.CONF = JSON.stringify(conf);
process.env.ENC = enc;

// Load tasks in tasks directory.
var gulp = require('gulp');
var requireDir = require('require-dir');
requireDir('gulp-tasks', {recurse: true});

var exec = require('child_process').exec;
var utils = require('./gulp-tasks/lib/utils');
var runSequence = require('run-sequence');

gulp.task('default', function () {
  runSequence(
    ['shell:node-kill'],
    ['once'],
    ['fepper:appendix'],
    ['fepper:json-compile'],
    ['fepper:pattern-override'],
    ['express'],
    ['patternlab:cd-in'],
    ['patternlab:watch', 'contrib', 'custom', 'open']
  );
});

gulp.task('data', [
  'fepper:json-compile'
]);

gulp.task('frontend-copy', function () {
  if (typeof conf.backend.synced_dirs.css_dir === 'string' && conf.backend.synced_dirs.css_dir.match(/^[\w.\/-]+$/)) {
    gulp.src('./' + conf.src + '/css/*')
      .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.css_dir));
  }
  if (typeof conf.backend.synced_dirs.fonts_dir === 'string' && conf.backend.synced_dirs.fonts_dir.match(/^[\w.\/-]+$/)) {
    gulp.src('./' + conf.src + '/fonts/*')
      .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.fonts_dir));
  }
  if (typeof conf.backend.synced_dirs.images_dir === 'string' && conf.backend.synced_dirs.images_dir.match(/^[\w.\/-]+$/)) {
    gulp.src('./' + conf.src + '/images/*')
      .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.images_dir));
  }
  if (typeof conf.backend.synced_dirs.js_dir === 'string' && conf.backend.synced_dirs.js_dir.match(/^[\w.\/-]+$/)) {
    gulp.src('./' + conf.src + '/js/*/**/*')
      .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.js_dir));
  }
  if (typeof conf.backend.synced_dirs.templates_dir === 'string' && conf.backend.synced_dirs.templates_dir.match(/^[\w.\/-]+$/)) {
    exec('node fepper/tasks/templater.js', utils.log);
  }
});

gulp.task('install', function () {
  runSequence(
    ['shell:node-kill'],
    ['install:copy'],
    ['install:config'],
    ['fepper:json-compile'],
    ['patternlab:cd-in'],
    ['shell:install-npm'],
    ['patternlab:cd-out'],
    ['once'],
    ['fepper:appendix'],
    ['fepper:json-compile'],
    ['fepper:pattern-override'],
    ['express'],
    ['patternlab:cd-in'],
    ['patternlab:watch', 'contrib', 'custom', 'open:install']
  );
});

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
    ['fepper:gh-pages'],
    ['gh-pages']
  );
});

 gulp.task('static', [
  'fepper:static-generate'
]);

 gulp.task('syncback', [
  'lint',
  'uglify',
  'frontend-copy'
]);
