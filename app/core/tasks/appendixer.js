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
  var appendix = utils.pathResolve(`${conf.ui.paths.source.data}/_appendix.json`);
  var varFile = utils.pathResolve(`${conf.ui.paths.source.js}/src/variables.styl`);
  var vars = fs.readFileSync(varFile, conf.enc);
  var varsSplit = vars.split('\n');

  for (let i = 0; i < varsSplit.length; i++) {
    let varLine = varsSplit[i].trim();
    // Find index of the first equal sign.
    let indexOfEqual = varLine.indexOf('=');

    if (indexOfEqual > -1) {
      if (i > 0 && jsonStr !== '{\n') {
        jsonStr += ',\n';
      }
      let key = varLine.slice(0, indexOfEqual).trim();
      let value = varLine.slice(indexOfEqual + 1).trim();

      if (key) {
        jsonStr += `  "${key}": "${value}"`;
      }
    }
  }
  jsonStr += '\n}\n';

  // Write out to _appendix.json.
  fs.writeFileSync(appendix, jsonStr);
};
