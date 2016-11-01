"use strict";

var lineage_hunter = function () {

  var pa = require('./pattern_assembler');

  function findlineage(content, pattern, patternlab) {

    var pattern_assembler = new pa();

    //find the {{> template-name }} within patterns
    var matches = pattern.engine.findPartials(content);
    if (matches !== null) {
      matches.forEach(function (match) {
        //get the ancestorPattern
        var ancestorPattern = pattern_assembler.getPartial(pattern.findPartial(match), patternlab);

        if (ancestorPattern && pattern.lineageIndex.indexOf(ancestorPattern.patternPartial) === -1) {
          //add it since it didnt exist
          pattern.lineageIndex.push(ancestorPattern.patternPartial);

          //create the more complex patternLineage object too
          var l = {
            "lineagePattern": ancestorPattern.patternPartial,
            "lineagePath": "../../patterns/" + ancestorPattern.patternLink
          };
          if (ancestorPattern.patternState) {
            l.lineageState = ancestorPattern.patternState;
          }

          pattern.lineage.push(l);

          //also, add the lineageR entry if it doesn't exist
          if (ancestorPattern.lineageRIndex.indexOf(pattern.patternPartial) === -1) {
            ancestorPattern.lineageRIndex.push(pattern.patternPartial);

            //create the more complex patternLineage object in reverse
            var lr = {
              "lineagePattern": pattern.patternPartial,
              "lineagePath": "../../patterns/" + pattern.patternLink
            };
            if (pattern.patternState) {
              lr.lineageState = pattern.patternState;
            }

            ancestorPattern.lineageR.push(lr);
          }
        }
      });
    }
  }

  return {
    find_lineage: function (content, pattern, patternlab) {
      findlineage(content, pattern, patternlab);
    }
  };
};

module.exports = lineage_hunter;
