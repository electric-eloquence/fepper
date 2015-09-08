(function () {
  'use strict';

  var fs = require('fs-extra');

  var utils = require('../lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir;

  var appendix = rootDir + '/' + conf.src + '/_data/_appendix.json';
  var i;
  var jsonStr = '{\n';
  var varFile = rootDir + '/' + conf.src + '/js/src/variables.styl';
  var varLine;
  var vars;
  var varsSplit;

  vars = fs.readFileSync(varFile, conf.enc);
  varsSplit = vars.split('\n');

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

})();
