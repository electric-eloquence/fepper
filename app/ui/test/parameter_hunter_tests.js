/* eslint-disable max-len */
'use strict';

var fs = require('fs-extra');
var jsonEval = require('json-eval');

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
var nestedPattern = pattern_assembler.getPartial('test-param-nested', patternlab);
var nesterPattern = pattern_assembler.getPartial('test-param-nester', patternlab);
var multiPattern = pattern_assembler.getPartial('test-multiple-params', patternlab);
var simplePattern = pattern_assembler.getPartial('test1-simple', patternlab);
var partialPattern = pattern_assembler.getPartial('test1-parametered-partial', patternlab);
var recursivePattern = pattern_assembler.getPartial('test1-recursive-includer', patternlab);
var antiInfinityPattern = pattern_assembler.getPartial('test1-anti-infinity-tester', patternlab);

var atomPartial = pattern_assembler.preRenderPartial(atomPattern, patternlab).tmpPartial;
var nestedPartial = pattern_assembler.preRenderPartial(nestedPattern, patternlab).tmpPartial;
var nesterPartial = pattern_assembler.preRenderPartial(nesterPattern, patternlab).tmpPartial;
var multiPartial = pattern_assembler.preRenderPartial(multiPattern, patternlab).tmpPartial;
var simplePartial = pattern_assembler.preRenderPartial(simplePattern, patternlab).tmpPartial;
var partialPartial = pattern_assembler.preRenderPartial(partialPattern, patternlab).tmpPartial;
var recursivePartial = pattern_assembler.preRenderPartial(recursivePattern, patternlab).tmpPartial;
var antiInfinityPartial = pattern_assembler.preRenderPartial(antiInfinityPattern, patternlab).tmpPartial;

pattern_assembler.renderPartials(atomPartial, atomPattern, patternlab);
pattern_assembler.renderPartials(nestedPartial, nestedPattern, patternlab);
pattern_assembler.renderPartials(nesterPartial, nesterPattern, patternlab);
pattern_assembler.renderPartials(multiPartial, multiPattern, patternlab);
pattern_assembler.renderPartials(simplePartial, simplePattern, patternlab);
pattern_assembler.renderPartials(partialPartial, partialPattern, patternlab);
pattern_assembler.renderPartials(recursivePartial, recursivePattern, patternlab);
pattern_assembler.renderPartials(antiInfinityPartial, antiInfinityPattern, patternlab);

atomPattern.extendedTemplate = pattern_assembler.extendPartials(atomPartial, engine);
nestedPattern.extendedTemplate = pattern_assembler.extendPartials(nestedPartial, engine);
nesterPattern.extendedTemplate = pattern_assembler.extendPartials(nesterPartial, engine);
multiPattern.extendedTemplate = pattern_assembler.extendPartials(multiPartial, engine);
simplePattern.extendedTemplate = pattern_assembler.extendPartials(simplePartial, engine);
partialPattern.extendedTemplate = pattern_assembler.extendPartials(partialPartial, engine);
recursivePattern.extendedTemplate = pattern_assembler.extendPartials(recursivePartial, engine);
antiInfinityPattern.extendedTemplate = pattern_assembler.extendPartials(antiInfinityPartial, engine);

var nestedRendered = pattern_assembler.renderPattern(nestedPattern, nestedPattern.allData);
var nesterRendered = pattern_assembler.renderPattern(nesterPattern, nesterPattern.allData);
var multiRendered = pattern_assembler.renderPattern(multiPattern, multiPattern.allData);
var recursiveRendered = pattern_assembler.renderPattern(recursivePattern, recursivePattern.allData);
var antiInfinityRendered = pattern_assembler.renderPattern(antiInfinityPattern, antiInfinityPattern.allData);

exports.parameter_hunter = {
  'parameter hunter finds and extends templates with a parameter': function (test) {
    test.expect(1);

    // assert
    test.equals(nestedRendered, '<span class="test_base "> paramMessage  </span>');

    test.done();
  },

  'parameter hunter finds and extends templates with multiple parameters': function (test) {
    test.expect(1);

    // assert
    test.equals(multiRendered, '<span class="test_base "> paramMessage description </span>');

    test.done();
  },

  'parameter hunter finds and extends templates with mixed parameter and global data': function (test) {
    test.expect(1);

    // assert
    test.equals(nesterRendered, ' <span class="test_base "> paramMessage  </span>');

    test.done();
  },

  // test quoting options.
  'parameter hunter parses parameters with unquoted keys and unquoted values': function (test) {
    test.expect(1);

    // arrange
    var param = '{description: true}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"description":true}');

    test.done();
  },

  'parameter hunter parses parameters with unquoted keys and double-quoted values': function (test) {
    test.expect(1);

    // arrange
    var param = '{description: "true"}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"description":"true"}');

    test.done();
  },

  'parameter hunter parses parameters with single-quoted keys and unquoted values': function (test) {
    test.expect(1);

    // arrange
    var param = '{\'description\': true}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"description":true}');

    test.done();
  },

  'parameter hunter parses parameters with single-quoted keys and single-quoted values wrapping internal escaped single-quotes': function (test) {
    test.expect(1);

    // arrange
    var param = '{\'description\': \'true not,\\\'true\\\'\'}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"description":"true not,\'true\'"}');

    test.done();
  },

  'parameter hunter parses parameters with single-quoted keys and double-quoted values wrapping internal single-quotes':
  function (test) {
    test.expect(1);

    // arrange
    var param = '{\'description\': "true not:\'true\'"}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"description":"true not:\'true\'"}');

    test.done();
  },

  'parameter hunter parses parameters with double-quoted keys and unquoted values': function (test) {
    test.expect(1);

    // arrange
    var param = '{"description": true}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"description":true}');

    test.done();
  },

  'parameter hunter parses parameters with double-quoted keys and single-quoted values wrapping internal double-quotes':
  function (test) {
    test.expect(1);

    // arrange
    var param = '{"description": \'true not{"true"\'}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"description":"true not{\\"true\\""}');

    test.done();
  },

  'parameter hunter parses parameters with double-quoted keys and double-quoted values wrapping internal escaped double-quotes': function (test) {
    test.expect(1);

    // arrange
    var param = '{"description": "true not}\\"true\\""}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"description":"true not}\\"true\\""}');

    test.done();
  },

  'parameter hunter parses parameters with combination of quoting schemes for keys and values': function (test) {
    test.expect(1);

    // arrange
    var param = '{description: true, \'foo\': false, "bar": false, \'single\': true, \'singlesingle\': \'true\', \'singledouble\': "true", "double": true, "doublesingle": \'true\', "doubledouble": "true"}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"description":true,"foo":false,"bar":false,"single":true,"singlesingle":"true","singledouble":"true","double":true,"doublesingle":"true","doubledouble":"true"}');

    test.done();
  },

  'parameter hunter parses parameters with values containing a closing parenthesis': function (test) {
    // From issue #291 https://github.com/pattern-lab/patternlab-node/issues/291
    test.expect(1);

    // arrange
    var param = '{description: \'Hello ) World\'}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"description":"Hello ) World"}');

    test.done();
  },

  'parameter hunter parses parameters that follow a non-quoted value': function (test) {
    // From issue #291 https://github.com/pattern-lab/patternlab-node/issues/291
    test.expect(1);

    // arrange
    var param = '{foo: true, bar: "Hello World"}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"foo":true,"bar":"Hello World"}');

    test.done();
  },

  'parameter hunter parses parameters whose keys contain escaped quotes': function (test) {
    // From issue #291 https://github.com/pattern-lab/patternlab-node/issues/291
    test.expect(1);

    // arrange
    var param = '{\'silly\\\'key\': true, bar: "Hello World", "another\\"silly-key": 42}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"silly\'key":true,"bar":"Hello World","another\\"silly-key":42}');

    test.done();
  },

  'parameter hunter skips malformed parameters': function (test) {
    // From issue #291 https://github.com/pattern-lab/patternlab-node/issues/291
    // arrange
    var param = '{missing-val: , : missing-key, : , , foo: "Hello World"}';
    jsonEval(param);

    // assert
    console.log('\nPattern Lab should catch JSON.parse() errors and output useful debugging information...');

    test.done();
  },

  'parameter hunter parses parameters containing html tags': function (test) {
    // From issue #145 https://github.com/pattern-lab/patternlab-node/issues/145
    test.expect(1);

    // arrange
    var param = '{tag1: \'<strong>Single-quoted</strong>\', tag2: "<em>Double-quoted</em>", tag3: \'<strong class=\\"foo\\" id=\\\'bar\\\'>With attributes</strong>\'}';
    var evald = jsonEval(param);

    // assert
    test.equals(JSON.stringify(evald), '{"tag1":"<strong>Single-quoted</strong>","tag2":"<em>Double-quoted</em>","tag3":"<strong class=\\"foo\\" id=\'bar\'>With attributes</strong>"}');

    test.done();
  },

  'parameter hunter correctly parses partial parameters for recursion beyond a single level': function (test) {
    test.expect(1);

    // assert
    test.equals(recursiveRendered, 'foo   ');

    test.done();
  },

  'parameter hunter correctly limits recursion on partials that call themselves but within restricted conditions':
  function (test) {
    test.expect(1);

    // assert
    test.equals(antiInfinityRendered, 'foo   foo    bar    ');

    test.done();
  }
};
