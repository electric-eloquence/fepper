/**
 * Writes the appendix to data.json.
 *
 * Since the last property appended to data.json by json-compiler.js ends in a
 * comma, we need this operation to append to data.json in such a way that the
 * last property ends in a closing brace without a comma. This also compiles the
 * data from variables.styl into data.json so it shares its cross-everything
 * data with Pattern Lab as well.
 */
(function () {
  'use strict';

  var fs = require('fs-extra');

  exports.main = function (workDir, conf) {
    var i;
    var jsonStr = '{\n';
    var srcDir = workDir + '/' + conf.src;
    var appendix = srcDir + '/_data/_appendix.json';
    var varFile = srcDir + '/scripts/src/variables.styl';
    var varLine;
    var vars = fs.readFileSync(varFile, conf.enc);
    var varsSplit = vars.split('\n');

    for (i = 0; i < varsSplit.length; i++) {
      varLine = varsSplit[i].trim();
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
})();
