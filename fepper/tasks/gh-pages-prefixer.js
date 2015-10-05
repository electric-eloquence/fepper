/**
 * Adds a path prefix when publishing to GitHub Pages.
 *
 * Fepper can easily be configured to serve assets in the backend directory.
 * However, if published on GitHub Pages, in order to also serve these assets,
 * their paths must be prefixed by the repository name. That can be set with
 * gh_pages_prefix in conf.yml or _data.json.
 */
(function () {
  'use strict';

  var fs = require('fs-extra');
  var glob = require('glob');

  var utils = require('../lib/utils');
  var conf = utils.conf();

  /**
   * Recursively glob pattern files, and then iterate through them.
   *
   * @param The {string} patternDir The directory to glob.
   * @return {array} The files in the directory.
   */
  exports.filesGet = function (ghPagesDir) {
    return glob.sync(ghPagesDir + '/**');
  };

  /**
   * Read globbed files, token replace path prefix tags, and write output.
   *
   * @param {array} files The files to process.
   */
  exports.filesProcess = function (files, confParam, webservedDirsShort, prefix) {
    var code;
    var codeSplit;
    var file;
    var i;
    var j;
    var k;
    var regex;
    var stats;

    for (i = 0; i < files.length; i++) {
      // Read each pattern file.
      stats = fs.statSync(files[i]);
      if (!stats.isFile()) {
        continue;
      }

      code = '';
      file = fs.readFileSync(files[i], confParam.enc);
      // Split code line by line for parsing.
      codeSplit = file.split('\n');
      for (j = 0; j < codeSplit.length; j++) {
        // Iterate through webservedDirsShort. Check to see if the line is
        // calling a path to the dir with href or src elements.
        for (k = 0; k < webservedDirsShort.length; k++) {
          // If the href of a tag matches one of the webservedDirsShort values,
          // add the gh_pages_prefix.
          regex = new RegExp('href="\/' + webservedDirsShort[k], 'g');
          if (codeSplit[j].match(regex)) {
            codeSplit[j] = codeSplit[j].replace(regex, 'href="' + prefix + '/' + webservedDirsShort[k]);
          }
          // If the src of a tag matches one of the webservedDirsShort,
          // add the gh_pages_prefix.
          regex = new RegExp('src="\/' + webservedDirsShort[k], 'g');
          if (codeSplit[j].match(regex)) {
            codeSplit[j] = codeSplit[j].replace(regex, 'src="' + prefix + '/' + webservedDirsShort[k]);
          }
        }
        code += codeSplit[j] + '\n';
      }

      fs.writeFileSync(files[i], code);
    }
  };

  exports.main = function (ghPagesDir) {
    var dataJson = utils.data(conf);
    var files;
    var prefix;
    var rootDir = utils.rootDir();
    var publicDir = rootDir + '/' + conf.pub;
    var webservedDirsShort;
    var webservedDirsFull;

    // Before checking for any gh_pages_prefix to insert, copy over the Pattern
    // Lab public directory to the fepper-gh-pages directory. Clean up any old
    // destination files before copying.
    utils.log('Preparing gh_pages_src...');
    fs.removeSync(ghPagesDir);
    // Then, copy.
    fs.copySync(publicDir, ghPagesDir);

    // Then, check for gh_pages_prefix. If it is set in conf.yml, that takes
    // priority over gh_pages_prefix set in data.json. The data.json setting can
    // be version controlled, while the conf.yml setting can override the version
    // controlled setting for local-specific exceptions.
    if (typeof conf.gh_pages_prefix === 'string') {
      prefix = conf.gh_pages_prefix;
    }
    else if (dataJson && typeof dataJson.gh_pages_prefix === 'string') {
      prefix = dataJson.gh_pages_prefix;
    }
    if (!prefix) {
      return;
    }

    // Similar to gh_pages_prefix, conf.yml takes priority over data.json.
    if (typeof conf.backend.webserved_dirs === 'object' && conf.backend.webserved_dirs) {
      webservedDirsFull = conf.backend.webserved_dirs;
    }
    else if (typeof dataJson.backend_webserved_dirs === 'object' && dataJson.backend_webserved_dirs) {
      webservedDirsFull = dataJson.backend_webserved_dirs;
    }
    if (!webservedDirsFull) {
      return;
    }

    webservedDirsShort = utils.webservedDirnamesTruncate(webservedDirsFull);

    if (webservedDirsShort.length) {
      utils.log('Prepending gh_pages_prefix...');
      // Recursively glob pattern files, and then iterate through them.
      files = exports.filesGet(ghPagesDir);
      // Read files, token replace path prefix tags, and write output.
      exports.filesProcess(files, conf, webservedDirsShort, prefix);
      // Copy webserved_dirs to gh_pages_src.
      utils.log('Copying webserved_dirs to gh_pages_src...');
      utils.webservedDirsCopy(webservedDirsFull, rootDir, webservedDirsShort, ghPagesDir);
    }
    utils.log('Finished preprocessing GitHub Pages files.');
  };
})();
