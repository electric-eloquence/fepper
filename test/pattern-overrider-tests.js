(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var path = require('path');
  var yaml = require('js-yaml');

  var utils = require('../fepper/lib/utils');
  var enc = utils.conf().enc;
  var rootDir = utils.rootDir();

  var testDir = rootDir + '/test/files';
  var yml = fs.readFileSync(testDir + '/conf/test.conf.yml', enc);
  var conf = yaml.safeLoad(yml);
  var poFile = testDir + '/' + conf.src + '/js/pattern-overrider.js';
  var Tasks = require(rootDir + '/fepper/tasks/tasks');
  var tasks = new Tasks(testDir, conf);

  describe('Pattern Overrider', function () {
    // Clear out pattern-overrider.js.
    fs.mkdirsSync(path.dirname(poFile));
    fs.writeFileSync(poFile, '');
    // Get empty string for comparison.
    var poBefore = fs.readFileSync(poFile, conf.enc);
    // Run pattern-overrider.js.
    tasks.patternOverride();
    // Get pattern-overrider.js output.
    var poAfter = fs.readFileSync(poFile, conf.enc);

    it('should overwrite pattern-overrider.js', function () {
      expect(poBefore).to.equal('');
      expect(poAfter).to.not.equal(poBefore);
    });
  });
})();
