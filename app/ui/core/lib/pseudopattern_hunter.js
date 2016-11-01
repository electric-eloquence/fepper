"use strict";

var pseudopattern_hunter = function () {

  function findpseudopatterns(pattern, patternlab) {
    var fs = require('fs-extra'),
      pa = require('./pattern_assembler'),
      lh = require('./lineage_hunter'),
      lih = require('./list_item_hunter'),
      Pattern = require('./object_factory').Pattern,
      plutils = require('./utilities'),
      path = require('path'),
      JSON5 = require('json5');

    var pattern_assembler = new pa();
    var lineage_hunter = new lh();
    var list_item_hunter = new lih();
    var paths = patternlab.config.paths;
    var hasPseudoPattern = false;
    var patternVariants = [];

    //look for a pseudopattern by checking if there is a file containing same
    //name, with ~ in it, ending in .json. if found, fill out that pattern
    for (var i = 0; i < patternlab.patterns.length; i++) {
      var patternVariant = patternlab.patterns[i];
      var fileName = pattern.fileName[0] === '_' ? pattern.fileName.slice(1) : pattern.fileName;
      if (
        patternVariant.relPath.indexOf(pattern.subdir + '/' + fileName + '~') === 0 &&
        patternVariant.relPath.slice(-5) === '.json'
      ) {
        if (patternlab.config.debug) {
          console.log('found pseudoPattern variant of ' + pattern.patternPartial);
        }

        //we want to do everything we normally would here, except instead read the pseudopattern data
        hasPseudoPattern = true;
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
          console.log('There was an error parsing pseudopattern JSON for ' + pattern.relPath);
          console.log(err);
        }

        //extend any existing data with variant data
        plutils.mergeData(pattern.allData, variantAllData);

        //fill out the properties of this pseudopattern
        patternVariant.jsonFileData = variantLocalData;
        patternVariant.template = pattern.template;
        patternVariant.fileExtension = pattern.fileExtension;
        patternVariant.extendedTemplate = pattern.extendedTemplate;
        patternVariant.isPseudoPattern = true;
        patternVariant.basePattern = pattern;
        patternVariant.allData = variantAllData;
        patternVariant.dataKeys = pattern_assembler.get_data_keys(variantLocalData);
        patternVariant.engine = pattern.engine;

        //process listitems
        list_item_hunter.process_list_item_partials(patternVariant, patternlab);

        //process the companion markdown file if it exists
        pattern_assembler.parse_pattern_markdown(patternVariant, patternlab);

        patternVariants.push(patternVariant);
      }
    }

    return patternVariants;
  }

  return {
    find_pseudopatterns: function (pattern, patternlab) {
      return findpseudopatterns(pattern, patternlab);
    }
  };

};

module.exports = pseudopattern_hunter;
