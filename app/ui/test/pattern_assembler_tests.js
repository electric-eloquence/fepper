/* eslint-disable max-len */
'use strict';

var fs = require('fs-extra');

var Pattern = require('../core/lib/object_factory').Pattern;
var pa = require('../core/lib/pattern_assembler');
var patternEngines = require('../core/lib/pattern_engines');
var plMain = require('../core/lib/patternlab');

var dummyPattern = Pattern.createEmpty();
var engine = patternEngines.getEngineForPattern(dummyPattern);
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
var navPattern = pattern_assembler.getPartial('test-nav', patternlab);

var atomPartial = pattern_assembler.preRenderPartial(atomPattern, patternlab).tmpPartial;
var molePartial = pattern_assembler.preRenderPartial(molePattern, patternlab).tmpPartial;
var orgaPartial = pattern_assembler.preRenderPartial(orgaPattern, patternlab).tmpPartial;
var navPartial = pattern_assembler.preRenderPartial(navPattern, patternlab).tmpPartial;

pattern_assembler.renderPartials(atomPartial, atomPattern, patternlab);
pattern_assembler.renderPartials(molePartial, molePattern, patternlab);
pattern_assembler.renderPartials(orgaPartial, orgaPattern, patternlab);
pattern_assembler.renderPartials(navPartial, navPattern, patternlab);

atomPattern.extendedTemplate = pattern_assembler.extendPartials(atomPartial, engine);
molePattern.extendedTemplate = pattern_assembler.extendPartials(molePartial, engine);
orgaPattern.extendedTemplate = pattern_assembler.extendPartials(orgaPartial, engine);
navPattern.extendedTemplate = pattern_assembler.extendPartials(navPartial, navPattern.engine);

var navRendered = pattern_assembler.renderPattern(navPattern, navPattern.allData);

// export test
exports.pattern_assembler = {
  'setState - applies any patternState matching the pattern': function (test) {
    test.expect(1);

    // arrange
    var pattern = {
      patternPartial: 'pages-homepage-emergency'
    };

    // act
    pattern_assembler.setState(pattern, patternlab);

    // assert
    test.equals(pattern.patternState, 'inprogress');

    test.done();
  },
  'setState - does not apply any patternState if nothing matches the pattern': function (test) {
    test.expect(1);

    // arrange
    var pattern = {
      key: 'pages-homepage',
      patternState: ''
    };

    // act
    pattern_assembler.setState(pattern, patternlab);

    // assert
    test.equals(pattern.patternState, '');

    test.done();
  },
  'preRenderPartial - creates a partial object for each unique partial keyed by its include tag': function (test) {
    test.expect(3);

    test.equals(atomPartial.key, '{{> 00-test/02-styled-atom }}');
    test.equals(molePartial.key, '{{> 00-test/03-styled-molecule }}');
    test.equals(orgaPartial.key, '{{> 00-test/04-styled-organism }}');

    test.done();
  },
  'renderPartials - recursively includes nested partials': function (test) {
    test.expect(3);

    // assert
    test.equals(orgaPartial.contentRendered, '{{> test-styled-molecule }}');
    test.equals(orgaPartial.nestedPartials.length, 1);
    test.equals(orgaPartial.nestedPartials[0].nestedPartials.length, 1);

    test.done();
  },
  'renderPartials - registers included partials for reuse': function (test) {
    test.expect(2);

    // arrange
    test.equals(patternlab.partials['{{> test-styled-atom:test_1 }}'], '{"key":"{{> test-styled-atom:test_1 }}","partial":"test-styled-atom","params":null,"content":"<span class=\\"test_base test_1\\"> {{ message }} {{ description }} </span>","contentRendered":"","nestedDataKeys":[],"nestedPartials":[]}');
    test.equals(patternlab.partials['{{> test-styled-molecule }}'], '{"key":"{{> test-styled-molecule }}","partial":"test-styled-molecule","params":null,"content":"{{> test-styled-atom:test_1 }}","contentRendered":"","nestedDataKeys":[],"nestedPartials":[]}');

    test.done();
  },
  'extendPartials - recursively populates extendedTemplate with content from nested includes': function (test) {
    test.expect(1);

    // act
    test.equals(
      orgaPattern.extendedTemplate, '<span class="test_base test_1"> {{ message }} {{ description }} </span>');

    test.done();
  },
  'parseDataLinks - replaces found link.* data for their expanded links' : function (test) {
    test.expect(1);

    test.equals(navRendered, '<a href="/patterns/twitter-brad/twitter-brad.html">Brad</a> <a href="/patterns/twitter-dave/twitter-dave.html">Dave</a> <a href="/patterns/twitter-brian/twitter-brian.html">Brian</a>');

    test.done();
  },
  'getPartial - matches by type-pattern shorthand syntax' : function (test) {
    test.expect(1);

    // act
    var result = pattern_assembler.getPartial('test-nav', patternlab);

    // assert
    test.equals(result.patternPartial, 'test-nav');

    test.done();
  },
  'getPartial - matches by full relative path' : function (test) {
    test.expect(1);

    // act
    var result = pattern_assembler.getPartial('00-test/00-foo.mustache', patternlab);

    // assert
    test.equals(result.relPath, '00-test/00-foo.mustache');

    test.done();
  },
  'getPartial - matches by relative path minus extension' : function (test) {
    test.expect(1);

    // act
    var result = pattern_assembler.getPartial('00-test/00-foo', patternlab);

    // assert
    test.equals(result.relPathTrunc, '00-test/00-foo');

    test.done();
  },
  'getPartial - enacts fuzzy match' : function (test) {
    test.expect(1);

    // act
    var result = pattern_assembler.getPartial('test-mixed', patternlab);

    // assert
    test.equals(result.patternPartial, 'test-mixed-params');

    test.done();
  }
};
