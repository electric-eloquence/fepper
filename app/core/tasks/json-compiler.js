/**
 * Compiles partial JSON files into data.json.
 *
 * Source files:
 * - _data.json
 * - the partial JSON files in the _patterns directory
 * - _appendix.json
 */
'use strict';

const conf = global.conf;

const fs = require('fs-extra');
const glob = require('glob');

const utils = require('../lib/utils');

exports.main = function () {
  var appendixTest = {};
  var dataDir = utils.pathResolve(conf.ui.paths.source.data);
  var globalsTest = {};
  var jsonStr = '';
  var partials;
  var patternsDir = utils.pathResolve(conf.ui.paths.source.patterns);
  var appendix = dataDir + '/_appendix.json';
  var dest = dataDir + '/data.json';
  var globals = dataDir + '/_data.json';
  var tmp;

  // Delete (optional) closing curly brace from _data.json.
  tmp = fs.readFileSync(globals, conf.enc);
  // Delete curly brace and any whitespace at end of file.
  tmp = tmp.replace(/\}\s*$/, '');
  tmp = tmp.replace(/\s*$/, '');
  jsonStr += tmp;
  // Only add comma if _data.json and _appendix.json have data.
  globalsTest = fs.readJsonSync(globals, {throws: false});
  appendixTest = fs.readJsonSync(appendix, {throws: false});
  for (let i in globalsTest) {
    if (globalsTest.hasOwnProperty(i)) {
      for (let j in appendixTest) {
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
  partials = glob.sync(patternsDir + '/**/_*.json');
  for (let i = 0; i < partials.length; i++) {
    tmp = fs.readFileSync(partials[i], conf.enc);
    // Delete curly brace and any whitespace at beginning of file.
    let openRegex = /^\s*\{/;
    if (openRegex.test(tmp)) {
      tmp = tmp.replace(openRegex, '');
      tmp = tmp.replace(/^\s*\n/, '');
      // Delete curly brace and any whitespace at end of file.
      tmp = tmp.replace(/\}\s*$/, '');
      tmp = tmp.replace(/\n\s*$/, '');
    }
    jsonStr += tmp + ',\n';
  }

  // Delete (optional) opening curly brace from _appendix.json.
  tmp = fs.readFileSync(appendix, conf.enc);
  // Delete curly brace and any whitespace at beginning of file.
  tmp = tmp.replace(/^\s*\{/, '');
  tmp = tmp.replace(/^\s*\n/, '');
  jsonStr += tmp;

  // Write out to data.json.
  fs.writeFileSync(dest, jsonStr);
};
