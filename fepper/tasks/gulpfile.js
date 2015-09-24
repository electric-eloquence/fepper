/**
 * This gulpfile is only for debugging task called by the Fepper class defined
 * in tasks.js. These tasks require that the process.cwd() be this directory.
 */
(function () {
  'use strict';

  var enc = 'utf8';
  var fs = require('fs-extra');
  var gulp = require('gulp');
  var requireDir = require('require-dir');
  var runSequence = require('run-sequence');
  var yaml = require('js-yaml');

  var yml = fs.readFileSync('../../conf.yml', enc);
  var conf = yaml.safeLoad(yml);

  // Write configs to global process.env object.
  // Apparently, process.env properties need to be strings.
  process.env.CONF = JSON.stringify(conf);
  process.env.ENC = enc;

  // Load tasks in tasks directory.
  requireDir('../../gulp', {recurse: true});
})();
