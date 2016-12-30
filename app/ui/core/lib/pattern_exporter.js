'use strict';

var beautify = require('js-beautify').html;
var fs = require('fs-extra');
var path = require('path');
var RcLoader = require('rcloader');

var pattern_exporter = function (configDir) {

  function exportPatterns(patternlab) {
    // read the config export options
    var exportPartials = patternlab.config.patternExportPatternPartials;
    var patternPartialCode;

    // load js-beautify with options configured in .jsbeautifyrc
    var rcLoader = new RcLoader('.jsbeautifyrc', {});
    var rcOpts = rcLoader.for(configDir, {lookup: true});

    if (!exportPartials || !exportPartials.constructor === Array) {
      return;
    }

    // find the chosen patterns to export
    for (var i = 0; i < exportPartials.length; i++) {
      for (var j = 0; j < patternlab.patterns.length; j++) {
        if (exportPartials[i] === patternlab.patterns[j].patternPartial) {
          // load .jsbeautifyrc and beautify html
          patternPartialCode = beautify(patternlab.patterns[j].patternPartialCode, rcOpts) + '\n';
          // write matches to the desired location
          fs.outputFileSync(
            path.resolve(
              configDir, patternlab.config.patternExportDirectory,
              patternlab.patterns[j].patternPartial + '.html'
            ),
            patternPartialCode
          );
          // free memory
          patternlab.patterns[j].patternPartialCode = '';
        }
      }
    }
  }

  return {
    exportPatterns: function (patternlab) {
      exportPatterns(patternlab);
    }
  };

};

module.exports = pattern_exporter;
