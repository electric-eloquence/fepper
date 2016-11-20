'use strict';

var fs = require('fs-extra');

var pa = require('../core/lib/pattern_assembler');
var plMain = require('../core/lib/patternlab');

var pattern_assembler = new pa();

var patternlab = fs.readJsonSync('./test/files/patternlab.json');
var patternsDir = './test/files/_patterns';

// iteratively populate the patternlab object for use through entire test
plMain.processAllPatternsIterative(pattern_assembler, patternsDir, patternlab);

// set up commonly used test patterns
// we don't want to run processPatternRecursive because it writes to the file system which is unnecessary for testing
// so we run its relevant subroutines
var atomPattern = pattern_assembler.getPartial('test-styled-atom', patternlab);
var molePattern = pattern_assembler.getPartial('test-styled-molecule', patternlab);
var orgaPattern = pattern_assembler.getPartial('test-styled-organism', patternlab);

var atomPartial = pattern_assembler.preRenderPartial(atomPattern, patternlab).tmpPartial;
var molePartial = pattern_assembler.preRenderPartial(molePattern, patternlab).tmpPartial;
var orgaPartial = pattern_assembler.preRenderPartial(orgaPattern, patternlab).tmpPartial;

pattern_assembler.renderPartials(atomPartial, atomPattern, patternlab);
pattern_assembler.renderPartials(molePartial, molePattern, patternlab);
pattern_assembler.renderPartials(orgaPartial, orgaPattern, patternlab);

exports.lineage_hunter = {
  'find_lineage - finds lineage': function (test) {
    test.expect(3);

    test.equals(orgaPattern.lineageIndex.length, 2);
    test.equals(orgaPattern.lineageIndex[0], 'test-styled-molecule');
    test.equals(orgaPattern.lineageIndex[1], 'test-styled-atom');

    test.done();
  },

  'find_lineage - finds reverse lineage': function (test) {
    test.expect(3);

    test.equals(atomPattern.lineageRIndex.length, 2);
    test.equals(atomPattern.lineageRIndex[0], 'test-styled-molecule');
    test.equals(atomPattern.lineageRIndex[1], 'test-styled-organism');

    test.done();
  }

};
