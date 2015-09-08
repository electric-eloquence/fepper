/**
 * Fepper can easily be configured to serve assets in the backend directory.
 * However, if published on GitHub Pages, in order to also serve these assets,
 * their paths must be prefixed by the repository name. That can be set with
 * gh_pages_path_prefix in conf.yml or _data.json.
 */
(function () {
  'use strict';

  var fs = require('fs-extra');
  var glob = require('glob');

  var utils = require('../lib/utils');
  var conf = utils.conf();
  var dataJson = utils.data(conf);
  var rootDir = utils.rootDir;

  var code;
  var codeSplit;
  var dest;
  var destDir;
  var file;
  var files;
  var i;
  var j;
  var k;
  var prefix;
  var replaced;
  var ghPagesDir;
  var patternDir = rootDir + '/' + conf.pub + '/patterns';
  var publicDir = rootDir + '/' + conf.pub;
  var stats;
  var webservedDirsShort = [];
  var webservedDirsFull;
  var webservedDirSplit;

  if (typeof conf.gh_pages_src === 'string' && conf.gh_pages_src.trim() !== '') {
    ghPagesDir = rootDir + '/' + conf.gh_pages_src;
  }
  else {
    // Quit if gh_pages_src not set.
    console.error('gh_pages_src not set.');
    return;
  }

  // Before checking for any gh_pages_path_prefix to insert, copy over the
  // Pattern Lab public directory to the fepper-gh-pages directory.
  // Clean up any old destination files before copying.
  console.log('Preparing gh_pages_src...');
  fs.removeSync(ghPagesDir);
  // Then, copy.
  fs.copySync(publicDir, ghPagesDir);

  // Then, check for gh_pages_path_prefix. If it is set in conf.yml, that takes
  // priority over gh_pages_path_prefix set in data.json. The data.json setting
  // can be version controlled, while the conf.yml setting can override the
  // version controlled setting for local-specific exceptions.
  if (typeof conf.gh_pages_path_prefix === 'string') {
    prefix = conf.gh_pages_path_prefix;
  }
  else if (typeof dataJson.gh_pages_path_prefix === 'string') {
    prefix = dataJson.gh_pages_path_prefix;
  }
  if (prefix) {
    // Similar to gh_pages_path_prefix, conf.yml takes priority over data.json.
    if (typeof conf.backend.webserved_dirs === 'object' && conf.backend.webserved_dirs) {
      webservedDirsFull = conf.backend.webserved_dirs;
    }
    else if (typeof dataJson.backend_webserved_dirs === 'object' && dataJson.backend_webserved_dirs) {
      webservedDirsFull = dataJson.backend_webserved_dirs;
    }
    if (webservedDirsFull) {
      // Remove first path element from webservedDirsFull and save to array.
      for (i = 0; i < webservedDirsFull.length; i++) {
        webservedDirSplit = webservedDirsFull[i].split('/');
        webservedDirSplit.shift();
        webservedDirsShort.push(webservedDirSplit.join('/'));
      }

      if (webservedDirsShort.length) {
        console.log('Prepending gh_pages_path_prefix...');
        // Recursively glob pattern files, and then iterate through them.
        files = glob.sync(patternDir + '/**');
        for (i = 0; i < files.length; i++) {
          // Read each pattern file.
          stats = fs.statSync(files[i]);
          if (stats.isFile()) {
            code = '';
            file = fs.readFileSync(files[i], conf.enc);
            // Split code line by line for parsing.
            codeSplit = file.split('\n');
            for (j = 0; j < codeSplit.length; j++) {
              // Iterate through webservedDirsShort. Check to see if the line is calling
              // a path to the dir with href or src elements.
              for (k = 0; k < webservedDirsShort.length; k++) {
                // If the src of a tag matches one of the webservedDirsShort, add the
                // gh_pages_path_prefix.
                if (replaced = codeSplit[j].replace('src="/' + webservedDirsShort[k], 'src="' + prefix + '/' + webservedDirsShort[k])) {
                  codeSplit[j] = replaced;
                  break;
                }
              }
              code += codeSplit[j] + '\n';
            }

            dest = files[i].replace(conf.pub, conf.gh_pages_src);
            destDir = dest.replace(/\/[^\/]*$/, '');
            fs.writeFileSync(dest, code);
          }
        }

        // Copy webserved_dirs to gh_pages_src.
        console.log('Copying webserved_dirs to gh_pages_src...');
        for (i = 0; i < webservedDirsFull.length; i++) {
          fs.copySync(rootDir + '/backend/' + webservedDirsFull[i], rootDir + '/' + conf.gh_pages_src + '/' + webservedDirsFull[i]);
        }
      }
    }
  }
  console.log('Finished preprocessing GitHub Pages files.');
})();
