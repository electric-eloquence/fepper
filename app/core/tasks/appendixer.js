/**
 * Writes the appendix to data.json.
 *
 * Since the last property appended to data.json by json-compiler.js ends in a
 * comma, we need this operation to append to data.json in such a way that the
 * last property ends in a closing brace without a comma. This also compiles the
 * data from variables.styl into data.json so it shares its cross-everything
 * data with Pattern Lab as well.
 */
'use strict';

const conf = global.conf;

const fs = require('fs-extra');

const utils = require('../lib/utils');

exports.main = function () {
  var jsonStr = '{\n';
  var appendix = utils.pathResolve(conf.ui.paths.source.data + '/_appendix.json');
  var varFile = utils.pathResolve(conf.ui.paths.source.js + '/src/variables.styl');
  var vars = fs.readFileSync(varFile, conf.enc);
  var varsSplit = vars.split('\n');

  for (let i = 0; i < varsSplit.length; i++) {
    let varLine = varsSplit[i].trim();
    // Skip comments.
    if (varLine.indexOf(';') !== 0) {
      // If there's an equal sign, replace the first equal sign with a colon.
      if (varLine.indexOf('=') > -1) {
        varLine = varLine.replace(/^(\w*)\s*/, '"$1"');
        varLine = varLine.replace('=', ':');
        jsonStr += '  ' + varLine + ',\n';
      }
    }
  }
  // Strip last comma.
  jsonStr = jsonStr.replace(/,\n$/, '\n');
  // All closing curly brace.
  jsonStr += '}\n';

  // Write out to _appendix.json.
  fs.writeFileSync(appendix, jsonStr);
};
