(function () {
  'use strict';

  var fs = require('fs-extra');
  var glob = require('glob');
  var path = require('path');

  var utils = require('../lib/utils');

  exports.assetsDirCopy = function (publicDir, staticDir) {
    fs.copySync(publicDir + '/assets', staticDir + '/assets');
  };

  exports.scriptsDirCopy = function (publicDir, staticDir) {
    fs.copySync(publicDir + '/scripts', staticDir + '/scripts');
  };

  exports.stylesDirCopy = function (publicDir, staticDir) {
    fs.copySync(publicDir + '/styles', staticDir + '/styles');
  };

  exports.pagesDirCompile = function (workDir, conf, patternDir, staticDir) {
    var dataJson = utils.data(workDir, conf);
    var dirs = [];
    var f;
    var files = [];
    var i;
    var j;
    var tmpArr = [];
    var tmpStr = '';

    // Glob page files in public/patterns.
    dirs = glob.sync(patternDir + '/*([0-9])?(-)pages-*');

    for (i = 0; i < dirs.length; i++) {
      tmpArr = glob.sync(dirs[i] + '/*');
      for (j = 0; j < tmpArr.length; j++) {
        files.push(tmpArr[j]);
      }
    }

    for (i = 0; i < files.length; i++) {
      f = files[i];
      if ((f.indexOf('html') === f.length - 4) && (f.indexOf('escaped.html') !== f.length - 12) && path.basename(f) !== 'index.html') {
        tmpStr = fs.readFileSync(f, conf.enc);
        // Fix paths.
        tmpStr = tmpStr.replace(/(href|src)\s*=\s*("|')..\/..\//g, '$1="');
        // Strip prefix from page filenames.
        tmpStr = tmpStr.replace(/(href\s*=\s*)("|').*(\/|&#x2F;)[\d-]*pages-/g, '$1$2');
        fs.writeFileSync(staticDir + '/' + f.replace(/^.*\/[\d-]*pages-/, ''), tmpStr);
        // Copy homepage to index.html.
        if (dataJson.homepage && f.indexOf(dataJson.homepage + '.html') !== -1) {
          fs.writeFileSync(staticDir + '/index.html', tmpStr);
        }
      }
    }
  };

  exports.main = function (workDir, conf) {
    var dataJson = utils.data(workDir, conf);
    var publicDir = workDir + '/' + conf.pub;
    var staticDir = workDir + '/' + conf.src + '/static';
    var webservedDirsFull;
    var webservedDirsShort;

    // Copy asset directories.
    exports.assetsDirCopy(publicDir, staticDir);
    exports.scriptsDirCopy(publicDir, staticDir);
    exports.stylesDirCopy(publicDir, staticDir);

    // Copy pages directory.
    exports.pagesDirCompile(workDir, conf, publicDir + '/patterns', staticDir);

    // Copy webserved directories.
    // conf.yml takes priority over data.json.
    if (conf.backend.webserved_dirs.constructor === Array) {
      webservedDirsFull = conf.backend.webserved_dirs;
    }
    else if (dataJson.backend_webserved_dirs.constructor === Array) {
      webservedDirsFull = dataJson.backend_webserved_dirs;
    }
    if (webservedDirsFull) {
      webservedDirsShort = utils.webservedDirnamesTruncate(webservedDirsFull);
      utils.webservedDirsCopy(webservedDirsFull, workDir, webservedDirsShort, staticDir);
    }
  };
})();
