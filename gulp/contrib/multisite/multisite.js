(function () {
  'use strict';

  var subsites = require('./subsites.js');

  if (typeof subsites === 'object' && subsites instanceof Array) {
    var gulp = require('gulp');

    gulp.task('custom:multisite', function (cb) {
    });
  }
})();
