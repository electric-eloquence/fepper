(function () {
  'use strict';

  var fs = require('fs-extra');
  var glob = require('glob');
  var path = require('path');

  var utils = require('../lib/utils');
  var conf = utils.conf();
  var dataJson = utils.data(conf);
  var rootDir = utils.rootDir();

  exports.cssDirCopy = function (pubDir, staticDir) {
    fs.copySync(pubDir + '/css', staticDir + '/css');
  };

  exports.fontsDirCopy = function (pubDir, staticDir) {
    fs.copySync(pubDir + '/fonts', staticDir + '/fonts');
  };

  exports.imagesDirCopy = function (pubDir, staticDir) {
    fs.copySync(pubDir + '/images', staticDir + '/images');
  };

  exports.jsDirCopy = function (pubDir, staticDir) {
    fs.copySync(pubDir + '/js', staticDir + '/js');
  };

  exports.pagesDirCompile = function (patternDir, staticDir) {
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

  exports.main = function () {
    var pubDir = rootDir + '/' + conf.pub;
    var staticDir = rootDir + '/' + conf.src + '/static';

    // Copy asset directories.
    exports.cssDirCopy(pubDir, staticDir);
    exports.fontsDirCopy(pubDir, staticDir);
    exports.imagesDirCopy(pubDir, staticDir);
    exports.jsDirCopy(pubDir, staticDir);

    // Copy pages directory.
    exports.pagesDirCompile(pubDir + '/patterns', staticDir);
  };
})();
