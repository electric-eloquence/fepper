(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var glob = require('glob');

  var utils = require('../fepper/lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();
  var testDir = rootDir + '/test/files';

  var appendixFile = testDir + '/_data/_appendix.json';
  var dataFile = testDir + '/_data/data.json';
  var jsonCompiler = require(rootDir + '/fepper/tasks/json-compiler');

  describe('JSON Compiler', function () {
    // Clear out data.json.
    fs.writeFileSync(dataFile, '');
    // Get empty string for comparison.
    var dataBefore = fs.readFileSync(dataFile, conf.enc);
    // Run json-compiler.js.
    jsonCompiler.main(testDir);
    // Get json-compiler.js output.
    var dataAfter = fs.readFileSync(dataFile, conf.enc);

    // Test valid JSON.
    var dataJson;
    try {
      dataJson = JSON.parse(dataAfter);
    }
    catch (err) {
      // Fail gracefully.
    }

    function stripBraces(jsonStr) {
      jsonStr = jsonStr.replace(/^\s*{\s*/, '');
      jsonStr = jsonStr.replace(/\s*}\s*$/, '');
      return jsonStr;
    }

    it('should overwrite data.json', function () {
      expect(dataBefore).to.equal('');
      expect(dataAfter).to.not.equal(dataBefore);
    });

    it('should compile valid JSON to data.json', function () {
      expect(dataJson).to.be.an('object');
    });

    it('should compile _data.json to data.json', function () {
      var _data = stripBraces(fs.readFileSync(testDir + '/_data/_data.json', conf.enc));
      expect(dataAfter).to.contain(_data);
    });

    it('should compile _patterns partials to data.json', function () {
      var partial;
      var partials = glob.sync(testDir + '/_patterns/**/_*.json');
      for (var i = 0; i < partials.length; i++) {
        partial = stripBraces(fs.readFileSync(partials[i], conf.enc));
        expect(dataAfter).to.contain(partial);
      }
    });

    it('should compile _appendix.json to data.json', function () {
      var appendix = stripBraces(fs.readFileSync(appendixFile, conf.enc));
      expect(dataAfter).to.contain(appendix);
    });
  });
})();
