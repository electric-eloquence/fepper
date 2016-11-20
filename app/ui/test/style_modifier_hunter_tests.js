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
var childPattern = pattern_assembler.getPartial('test-styled-atom', patternlab);
childPattern.partialInterface = pattern_assembler.getPartialInterface(childPattern);

exports.consume_style_modifier = {
  'replaces a style modifier tag with a class submitted from the immediate parent': function (test) {
    test.expect(1);

    // arrange
    var parentPattern = pattern_assembler.getPartial('test-styled-molecule', patternlab);
    parentPattern.partialInterface = pattern_assembler.getPartialInterface(parentPattern);

    // act
    engine.registerPartial(parentPattern.template, childPattern, patternlab, pattern_assembler.getPartial);
    var styleModifiedPartial = JSON.parse(patternlab.partials[parentPattern.template]);

    // assert
    test.equals(
      styleModifiedPartial.content, '<span class="test_base test_1"> {{ message }} {{ description }} </span>');

    test.done();
  },

  'replaces pipe-delimited multiple style modifiers with space-delimited classes': function (test) {
    test.expect(1);

    // arrange
    var parentPattern = pattern_assembler.getPartial('test-multiple-classes', patternlab);
    parentPattern.partialInterface = pattern_assembler.getPartialInterface(parentPattern);

    // act
    engine.registerPartial(parentPattern.template, childPattern, patternlab, pattern_assembler.getPartial);
    var styleModifiedPartial = JSON.parse(patternlab.partials[parentPattern.template]);

    // assert
    test.equals(
      styleModifiedPartial.content, '<span class="test_base foo1 foo2"> {{ message }} {{ description }} </span>');

    test.done();
  },

  'replaces a style modifier tag with a single class when the parent also submits a parameter': function (test) {
    test.expect(1);

    // arrange
    var parentPattern = pattern_assembler.getPartial('test-mixed-params', patternlab);
    parentPattern.partialInterface = pattern_assembler.getPartialInterface(parentPattern);

    // act
    engine.registerPartial(parentPattern.template, childPattern, patternlab, pattern_assembler.getPartial);
    var styleModifiedPartial = JSON.parse(patternlab.partials[parentPattern.template]);

    // assert
    test.equals(styleModifiedPartial.content, '<span class="test_base test_2"> 1 {{ description }} </span>');

    test.done();
  },

  'replaces a style modifier tag with multiple classes when the parent also submits a parameter': function (test) {
    test.expect(1);

    // arrange
    var parentPattern = pattern_assembler.getPartial('test-multiple-classes-params', patternlab);
    parentPattern.partialInterface = pattern_assembler.getPartialInterface(parentPattern);

    // act
    engine.registerPartial(parentPattern.template, childPattern, patternlab, pattern_assembler.getPartial);
    var styleModifiedPartial = JSON.parse(patternlab.partials[parentPattern.template]);

    // assert
    test.equals(styleModifiedPartial.content, '<span class="test_base foo1 foo2"> 2 {{ description }} </span>');

    test.done();
  },

  'recursively replaces a style modifier tag in a child nested below the immediate child of the first parent': function
  (test) {
    test.expect(1);

    // arrange
    var parentPattern = pattern_assembler.getPartial('test-styled-organism', patternlab);
    var tmpPartial = pattern_assembler.preRenderPartial(parentPattern, patternlab).tmpPartial;

    // act
    pattern_assembler.renderPartials(tmpPartial, parentPattern, patternlab);
    parentPattern.extendedTemplate = pattern_assembler.extendPartials(tmpPartial, engine);
    var parentRendered = pattern_assembler.renderPattern(parentPattern, parentPattern.allData);

    // assert
    test.equals(parentRendered, '<span class="test_base test_1">   </span>');

    test.done();
  }
};
