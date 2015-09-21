(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var path = require('path');

  var utils = require('../fepper/lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();

  var patternOverrider = require(rootDir + '/fepper/tasks/pattern-overrider');
  var poFile = rootDir + '/' + conf.pub + '/js/pattern-overrider.js';

  describe('Pattern Overrider', function () {
    // Clear out pattern-overrider.js.
    fs.mkdirsSync(path.dirname(poFile));
    fs.writeFileSync(poFile, '');
    // Get empty string for comparison.
    var poBefore = fs.readFileSync(poFile, conf.enc);
    // Run pattern-overrider.js.
    patternOverrider.main();
    // Get pattern-overrider.js output.
    var poAfter = fs.readFileSync(poFile, conf.enc);

    it('should overwrite pattern-overrider.js', function () {
      expect(poBefore).to.equal('');
      expect(poAfter).to.not.equal(poBefore);
    });
  });
})();
