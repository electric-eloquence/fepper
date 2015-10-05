(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');

  var utils = require('../fepper/lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();
  var testDir = rootDir + '/test/files';

  var appendixer = require(rootDir + '/fepper/tasks/appendixer');
  var appendixFile = testDir + '/_data/_appendix.json';

  describe('Appendixer', function () {
    // Clear out _appendix.json.
    fs.writeFileSync(appendixFile, '');
    // Get empty string for comparison.
    var appendixBefore = fs.readFileSync(appendixFile, conf.enc);
    // Run appendixer.js.
    appendixer.main(testDir);
    // Get appendixer.js output.
    var appendixAfter = fs.readFileSync(appendixFile, conf.enc);

    // Test valid JSON.
    var appendixJson;
    try {
      appendixJson = JSON.parse(appendixAfter);
    }
    catch (er) {
      // Fail gracefully.
    }

    it('should overwrite _appendix.json', function () {
      expect(appendixBefore).to.equal('');
      expect(appendixAfter).to.not.equal(appendixBefore);
    });

    it('should compile variables.styl to _appendix.json as valid JSON', function () {
      expect(appendixJson).to.be.an('object');
    });
  });
})();
