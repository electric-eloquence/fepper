(function () {
  'use strict';

  var fs = require('fs-extra');
  var glob = require('glob');

  var utils = require('../lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir;

  var dirs = [];
  var f;
  var files = [];
  var i;
  var j;
  var pubDir = rootDir + '/' + conf.pub;
  var patternDir = pubDir + '/patterns';
  var staticDir = rootDir + '/' + conf.src + '/static';
  var tmpArr = [];
  var tmpStr = '';

  // Copy asset directories.
  fs.copySync(pubDir + '/css', staticDir + '/css');
  fs.copySync(pubDir + '/fonts', staticDir + '/fonts');
  fs.copySync(pubDir + '/images', staticDir + '/images');
  fs.copySync(pubDir + '/js', staticDir + '/js');

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
    if ((f.indexOf('html') === f.length - 4) && (f.indexOf('escaped.html') !== f.length - 12)) {
      tmpStr = fs.readFileSync(f, conf.enc);
      // Fix paths.
      tmpStr = tmpStr.replace(/(href|src)\s*=\s*("|')..\/..\//g, '$1="');
      // Strip prefix from page filenames.
      tmpStr = tmpStr.replace(/(href\s*=\s*)("|').*(\/|&#x2F;)[\d-]*pages-/g, '$1$2');
      fs.writeFileSync(staticDir + '/' + f.replace(/^.*\/[\d-]*pages-/, ''), tmpStr);
    }
  }
})();
