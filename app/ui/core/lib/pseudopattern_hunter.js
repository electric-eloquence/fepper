"use strict";

var pseudopattern_hunter = function () {

  function findpseudopatterns(currentPattern, patternlab) {
    var fs = require('fs-extra'),
      pa = require('./pattern_assembler'),
      lh = require('./lineage_hunter'),
      Pattern = require('./object_factory').Pattern,
      plutils = require('./utilities'),
      path = require('path'),
      JSON5 = require('json5');

    var pattern_assembler = new pa();
    var lineage_hunter = new lh();
    var paths = patternlab.config.paths;

    //look for a pseudopattern by checking if there is a file containing same
    //name, with ~ in it, ending in .json. if found, fill out that pattern
    for (var i = 0; i < patternlab.patterns.length; i++) {
      var patternVariant = patternlab.patterns[i];
      if (
        patternVariant.relPath.indexOf(currentPattern.subdir + '/' + currentPattern.fileName + '~') === 0 &&
        patternVariant.relPath.slice(-5) === '.json'
      ) {
        if (patternlab.config.debug) {
          console.log('found pseudoPattern variant of ' + currentPattern.patternPartial);
        }

        //we want to do everything we normally would here, except instead read the pseudopattern data
        var variantFilename = path.resolve(patternlab.config.paths.source.patterns, patternVariant.relPath);
        var variantFileStr = '';
        var variantLocalData = {};
        var variantAllData = {};
        try {
          variantFileStr = fs.readFileSync(variantFilename, 'utf8');
          variantLocalData = JSON5.parse(variantFileStr);

          //clone. do not reference
          variantAllData = JSON5.parse(variantFileStr);
        } catch (err) {
          console.log('There was an error parsing pseudopattern JSON for ' + currentPattern.relPath);
          console.log(err);
        }

        //extend any existing data with variant data
        plutils.mergeData(currentPattern.jsonFileData, variantLocalData);
        plutils.mergeData(currentPattern.allData, variantAllData);

        //fill out the properties of this pseudopattern
        patternVariant.jsonFileData = variantLocalData;
        patternVariant.template = currentPattern.template;
        patternVariant.fileExtension = currentPattern.fileExtension;
        patternVariant.extendedTemplate = currentPattern.extendedTemplate;
        patternVariant.isPseudoPattern = true;
        patternVariant.basePattern = currentPattern;
        patternVariant.allData = variantAllData;
        patternVariant.dataKeys = pattern_assembler.get_data_keys(variantLocalData);
        patternVariant.engine = currentPattern.engine;

        //process the companion markdown file if it exists
        pattern_assembler.parse_pattern_markdown(patternVariant, patternlab);

        //find pattern lineage
        lineage_hunter.find_lineage(patternVariant, patternlab);
      }
    }
  }

  return {
    find_pseudopatterns: function (pattern, patternlab) {
      findpseudopatterns(pattern, patternlab);
    }
  };

};

module.exports = pseudopattern_hunter;
