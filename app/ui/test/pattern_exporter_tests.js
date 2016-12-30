/* eslint-disable max-len */
'use strict';

var fs = require('fs-extra');
var path = require('path');

var Pattern = require('../core/lib/object_factory').Pattern;
var pa = require('../core/lib/pattern_assembler');
var pe = require('../core/lib/pattern_exporter');
var patternEngines = require('../core/lib/pattern_engines');
var plMain = require('../core/lib/patternlab');

var dummyPattern = Pattern.createEmpty();
var engine = patternEngines.getEngineForPattern(dummyPattern);
var exportsDir = path.resolve(__dirname, 'files');
var pattern_assembler = new pa();
var pattern_exporter = new pe(exportsDir);

var existsBefore;
var existsAfter;
var fileContents;
var patternExportDirectory;
var patternlab = fs.readJsonSync('./test/files/patternlab.json');
var patternsDir = './test/files/_patterns/';
var testFile;

// iteratively populate the patternlab object for use through entire test
plMain.processAllPatternsIterative(pattern_assembler, patternsDir, patternlab);

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

atomPattern.extendedTemplate = pattern_assembler.extendPartials(atomPartial, engine);
molePattern.extendedTemplate = pattern_assembler.extendPartials(molePartial, engine);
orgaPattern.extendedTemplate = pattern_assembler.extendPartials(orgaPartial, engine);

exports.pattern_exporter_test = {
  'should export a rendered pattern when patternExportsDirectory has a leading dot-slash and trailing slash': function (test) {
    test.expect(3);

    // arrange
    orgaPattern.patternPartialCode = pattern_assembler.renderPattern(orgaPattern, orgaPattern.allData);
    patternExportDirectory = './pattern_exports/';
    patternlab.config.patternExportDirectory = patternExportDirectory;
    testFile = path.resolve(exportsDir, patternExportDirectory, 'test-styled-organism.html');

    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }

    // act
    existsBefore = fs.existsSync(testFile);
    pattern_exporter.exportPatterns(patternlab);
    existsAfter = fs.existsSync(testFile);
    fileContents = fs.readFileSync(testFile, 'utf8').trim();

    // assert
    test.equals(existsBefore, false);
    test.equals(existsAfter, true);
    test.equals(fileContents, '<span class="test_base test_1">   </span>');

    test.done();
  },
  'should export a rendered pattern when patternExportsDirectory has a leading dot-slash and no trailing slash': function (test) {
    test.expect(3);

    // arrange
    orgaPattern.patternPartialCode = pattern_assembler.renderPattern(orgaPattern, orgaPattern.allData);
    patternExportDirectory = './pattern_exports';
    patternlab.config.patternExportDirectory = patternExportDirectory;
    testFile = path.resolve(exportsDir, patternExportDirectory, 'test-styled-organism.html');

    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }

    // act
    existsBefore = fs.existsSync(testFile);
    pattern_exporter.exportPatterns(patternlab);
    existsAfter = fs.existsSync(testFile);
    fileContents = fs.readFileSync(testFile, 'utf8').trim();

    // assert
    test.equals(existsBefore, false);
    test.equals(existsAfter, true);
    test.equals(fileContents, '<span class="test_base test_1">   </span>');

    test.done();
  },
  'should export a rendered pattern when patternExportsDirectory has no leading dot-slash and a trailing slash': function (test) {
    test.expect(3);

    // arrange
    orgaPattern.patternPartialCode = pattern_assembler.renderPattern(orgaPattern, orgaPattern.allData);
    patternExportDirectory = 'pattern_exports/';
    patternlab.config.patternExportDirectory = patternExportDirectory;
    testFile = path.resolve(exportsDir, patternExportDirectory, 'test-styled-organism.html');

    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }

    // act
    existsBefore = fs.existsSync(testFile);
    pattern_exporter.exportPatterns(patternlab);
    existsAfter = fs.existsSync(testFile);
    fileContents = fs.readFileSync(testFile, 'utf8').trim();

    // assert
    test.equals(existsBefore, false);
    test.equals(existsAfter, true);
    test.equals(fileContents, '<span class="test_base test_1">   </span>');

    test.done();
  },
  'should export a rendered pattern when patternExportsDirectory has no leading dot-slash and no trailing slash': function (test) {
    test.expect(3);

    // arrange
    orgaPattern.patternPartialCode = pattern_assembler.renderPattern(orgaPattern, orgaPattern.allData);
    patternExportDirectory = 'pattern_exports';
    patternlab.config.patternExportDirectory = patternExportDirectory;
    testFile = path.resolve(exportsDir, patternExportDirectory, 'test-styled-organism.html');

    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }

    // act
    existsBefore = fs.existsSync(testFile);
    pattern_exporter.exportPatterns(patternlab);
    existsAfter = fs.existsSync(testFile);
    fileContents = fs.readFileSync(testFile, 'utf8').trim();

    // assert
    test.equals(existsBefore, false);
    test.equals(existsAfter, true);
    test.equals(fileContents, '<span class="test_base test_1">   </span>');

    test.done();
  }
};
