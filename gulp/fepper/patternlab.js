var conf = global.conf;
var fs = require('fs-extra');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

function patternlab_build(arg, chdir) {
  if (typeof chdir === 'string') {
    process.chdir(chdir);
  }
  var patternlab_engine = require('../../' + conf.bld + '/patternlab.js');
  var patternlab = patternlab_engine();

  if (arg === 'v') {
    patternlab.version();
  }
  else if (arg === 'only-patterns') {
    patternlab.build_patterns_only();
  }
  else if (arg === 'help') {
    patternlab.help();
  }
  else {
    patternlab.build();
  }
}

function patternlab_copy() {
  gulp.src('./source/_data/annotations.js')
    .pipe(gulp.dest('./public/data/'));
  gulp.src('./source/css/**/*')
    .pipe(gulp.dest('./public/css/'));
  gulp.src('./source/fonts/**/*')
    .pipe(gulp.dest('./public/fonts/'));
  gulp.src('./source/images/**/*')
    .pipe(gulp.dest('./public/images/'));
  gulp.src('./source/js/**/*')
    .pipe(gulp.dest('./public/js/'));
  gulp.src('./source/static/**/*')
    .pipe(gulp.dest('./public/static/'));
}

gulp.task('patternlab:build', function (cb) {
  patternlab_build();
  cb();
});

gulp.task('patternlab:cd-in', function (cb) {
  process.chdir(conf.pln);
  cb();
});

gulp.task('patternlab:cd-in-to-fepper', function (cb) {
  process.chdir('../fepper/tasks/');
  cb();
});

gulp.task('patternlab:cd-out', function (cb) {
  process.chdir('..');
  cb();
});

gulp.task('patternlab:cd-out-of-fepper', function (cb) {
  process.chdir('../../' + conf.pln);
  cb();
});

gulp.task('patternlab:clean', function (cb) {
  fs.removeSync('./public/patterns');
  cb();
});

gulp.task('patternlab:copy', function (cb) {
  patternlab_copy();
  cb();
});

gulp.task('patternlab:copy-css', function () {
  return gulp.src('./source/css/**/*')
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('patternlab:data', function () {
  runSequence(
    ['patternlab:cd-in-to-fepper'],
    ['fepper:appendix'],
    ['fepper:json-compile'],
    ['patternlab:cd-out-of-fepper']
  );
});

gulp.task('patternlab:help', function (cb) {
  patternlab_build('help', conf.pln);
  cb();
});

gulp.task('patternlab:install', function (cb) {
  patternlab_build();
  patternlab_copy();
  cb();
});

gulp.task('patternlab:only-patterns', function (cb) {
  patternlab_build('only-patterns', conf.pln);
  cb();
});

gulp.task('patternlab:v', function (cb) {
  patternlab_build('v', conf.pln);
  cb();
});

gulp.task('patternlab:watch', function () {
  plugins.livereload.listen();
  gulp.watch('public/!(css|patterns|styleguide)/**', ['livereload:assets'])
  gulp.watch('public/**/*.css', ['livereload:inject']);
  gulp.watch('public/index.html', ['livereload:index']);
  gulp.watch('source/_data/!(_)*.json', ['patternlab:build']);
  gulp.watch('source/_data/annotations.js', ['patternlab:copy'])
  gulp.watch('source/_patternlab-files/**/*.mustache', ['patternlab:build']);
  gulp.watch('source/_patterns/**/!(_)*.json', ['patternlab:build']);
  gulp.watch('source/_patterns/**/*.mustache', ['patternlab:clean', 'patternlab:build']);
  gulp.watch('source/_patterns/**/_*.json', ['patternlab:data']);
  gulp.watch('source/css/**/*', ['patternlab:copy-css']);
  gulp.watch('source/fonts/**/*', ['patternlab:copy']);
  gulp.watch('source/images/**/*', ['patternlab:copy']);
  gulp.watch('source/js/**/*', ['patternlab:copy']);
  gulp.watch('source/static/**/*', ['patternlab:copy']);
});
