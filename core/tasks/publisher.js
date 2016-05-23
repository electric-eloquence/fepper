/**
 * Adds a path prefix when publishing to GitHub Pages.
 *
 * Fepper can easily be configured to serve assets in the backend directory.
 * However, if published on GitHub Pages, in order to also serve these assets,
 * their paths must be prefixed by the repository name. That can be set with
 * gh_pages_prefix in pref.yml.
 */
'use strict';

var fs = require('fs-extra');
var ghpages = require('gh-pages');
var glob = require('glob');
var path = require('path');

var utils = require('../lib/utils');

/**
 * Recursively glob pattern files, and then iterate through them.
 *
 * @param {string} ghPagesDir - The directory to glob.
 * @return {array} The files in the directory.
 */
exports.filesGet = function (ghPagesDir) {
  return glob.sync(ghPagesDir + '/**');
};

/**
 * Read globbed files, token replace path prefix tags, and write output.
 *
 * @param {array} publicFiles - The files to process.
 * @param {object} conf - Configuration object.
 * @param {array} webservedDirsShort - Path to directories webserved by Fepper
 *   truncated for publishing to GitHub Pages.
 * @param {string} prefix - The repository name prefixing the document root.
 * @param {string} workDir - Fepper's root directory.
 * @param {string} ghPagesSrc - The directory that holds the processed code to
 *   be published to GitHub Pages.
 */
exports.filesProcess = function (publicFiles, conf, webservedDirsShort, prefix, workDir, ghPagesSrc) {
  var code;
  var codeSplit;
  var publicFile;
  var ghPagesSrcFile;
  var i;
  var j;
  var k;
  var regex;
  var stats;

  for (i = 0; i < publicFiles.length; i++) {
    // Read each pattern file.
    stats = fs.statSync(publicFiles[i]);
    if (!stats.isFile()) {
      continue;
    }

    code = '';
    publicFile = fs.readFileSync(publicFiles[i], conf.enc);
    // Split code line by line for parsing.
    codeSplit = publicFile.split('\n');
    for (j = 0; j < codeSplit.length; j++) {
      // Iterate through webservedDirsShort. Check to see if the line is
      // calling a path to the dir with href or src elements.
      for (k = 0; k < webservedDirsShort.length; k++) {
        // If the href of a tag matches one of the webservedDirsShort values,
        // add the gh_pages_prefix.
        regex = new RegExp('href="\/' + webservedDirsShort[k], 'g');
        if (codeSplit[j].match(regex)) {
          codeSplit[j] = codeSplit[j].replace(regex, 'href="/' + prefix + '/' + webservedDirsShort[k]);
        }
        // If the src of a tag matches one of the webservedDirsShort,
        // add the gh_pages_prefix.
        regex = new RegExp('src="\/' + webservedDirsShort[k], 'g');
        if (codeSplit[j].match(regex)) {
          codeSplit[j] = codeSplit[j].replace(regex, 'src="/' + prefix + '/' + webservedDirsShort[k]);
        }
      }
      code += codeSplit[j] + '\n';
    }

    ghPagesSrcFile = publicFiles[i].replace(workDir + '/' + conf.pub, ghPagesSrc);
    fs.outputFileSync(ghPagesSrcFile, code);
  }
};

exports.main = function (workDir, publishDir, conf, pref, test) {
  var ghPagesSrc = path.normalize(publishDir + '/../' + pref.gh_pages_src);
  var publicDir = workDir + '/' + conf.pub;
  var prefix;
  var publicFiles;
  var webservedDirsShort;
  var webservedDirsFull;

  // First, make sure pref.gh_pages_src is set.
  if (!pref.gh_pages_src) {
    utils.warn('gh_pages_src not set for ' + workDir + '. Skipping...');
    return;
  }

  // Then, check for gh_pages_prefix in pref.yml.
  if (typeof pref.gh_pages_prefix === 'string') {
    prefix = pref.gh_pages_prefix;
  }

  // Then, check for backend.webserved_dirs in pref.yml.
  if (Array.isArray(pref.backend.webserved_dirs)) {
    webservedDirsFull = pref.backend.webserved_dirs;
  }

  var p = new Promise(function (resolve, reject) {
    // Before checking for any gh_pages_prefix to insert, clean up any old
    // destination files before copying.
    utils.log('Preparing gh_pages_src...');
    fs.removeSync(ghPagesSrc);

    // Get array of truncated dirnames for processing.
    webservedDirsShort = utils.webservedDirnamesTruncate(webservedDirsFull);

    if (prefix) {
      utils.log('Prepending gh_pages_prefix...');
    }

    // Recursively glob pattern files, and then iterate through them.
    publicFiles = exports.filesGet(publicDir);
    // Read files, token replace path prefix tags, and write output.
    exports.filesProcess(publicFiles, conf, webservedDirsShort, prefix, workDir, ghPagesSrc);

    // Copy webserved_dirs to gh_pages_src.
    if (webservedDirsShort.length) {
      utils.log('Copying webserved_dirs to gh_pages_src...');
      utils.webservedDirsCopy(webservedDirsFull, workDir, webservedDirsShort, ghPagesSrc);
    }

    resolve();
  });
  p.then(function () {
    utils.log('Finished preprocessing GitHub Pages files.');

    if (!test) {
      utils.log('Publishing gh_pages_src to GitHub Pages...');

      ghpages.publish(ghPagesSrc, function (err) {
        if (err) {
          utils.error(err);
        }
        else {
          utils.log('Finished publishing gh_pages_src to GitHub Pages.');
        }
      });
    }
  })
  .catch(function (reason) {
    utils.error(reason);
  });
};
