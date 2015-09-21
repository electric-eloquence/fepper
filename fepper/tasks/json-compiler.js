/**
 * Compiles partial JSON files into data.json.
 *
 * Source files:
 * - _data.json
 * - the partial JSON files in the _patterns directory
 * - _appendix.json
 */
(function () {
  'use strict';

  var fs = require('fs-extra');
  var glob = require('glob');

  var utils = require('../lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();

  exports.main = function () {
    var appendix = rootDir + '/' + conf.src + '/_data/_appendix.json';
    var appendixTest = {};
    var dest = rootDir + '/' + conf.src + '/_data/data.json';
    var globals = rootDir + '/' + conf.src + '/_data/_data.json';
    var globalsTest = {};
    var i;
    var j;
    var jsonStr = '';
    var partials;
    var tmp;

    // Delete (optional) closing curly brace from _data.json.
    tmp = fs.readFileSync(globals, conf.enc);
    // Delete curly brace and any whitespace at end of file.
    tmp = tmp.replace(/}\s*$/, '');
    tmp = tmp.replace(/\s*$/, '');
    jsonStr += tmp;
    // Only add comma if _data.json and _appendix.json have data.
    globalsTest = fs.readJsonSync(globals, {throws: false});
    appendixTest = fs.readJsonSync(appendix, {throws: false});
    for (i in globalsTest) {
      if (globalsTest.hasOwnProperty(i)) {
        for (j in appendixTest) {
          if (appendixTest.hasOwnProperty(j)) {
            jsonStr += ',';
            break;
          }
        }
        break;
      }
    }
    jsonStr += '\n';

    // Delete (optional) opening and closing curly brace from json partials.
    partials = glob.sync(rootDir + '/' +  conf.src + '/_patterns/**/_*.json');
    for (i = 0; i < partials.length; i++) {
      tmp = fs.readFileSync(partials[i], conf.enc);
      // Delete curly brace and any whitespace at beginning of file.
      tmp = tmp.replace(/^\s*{/, '');
      tmp = tmp.replace(/^\s*\n/, '');
      // Delete curly brace and any whitespace at end of file.
      tmp = tmp.replace(/}\s*$/, '');
      tmp = tmp.replace(/\n\s*$/, '');
      jsonStr += tmp + ',\n';
    }

    // Delete (optional) opening curly brace from _appendix.json.
    tmp = fs.readFileSync(appendix, conf.enc);
    // Delete curly brace and any whitespace at beginning of file.
    tmp = tmp.replace(/^\s*{/, '');
    tmp = tmp.replace(/^\s*\n/, '');
    jsonStr += tmp;

    // Write out to data.json.
    fs.writeFileSync(dest, jsonStr);
  };
})();
