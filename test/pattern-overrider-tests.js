(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var path = require('path');
  var yaml = require('js-yaml');

  var utils = require('../core/lib/utils');
  var enc = utils.conf().enc;
  var rootDir = utils.rootDir();

  var yml = fs.readFileSync(rootDir + '/test/conf.yml', enc);
  var conf = yaml.safeLoad(yml);
  var testDir = rootDir + '/' + conf.test_dir;
  var poFile = testDir + '/' + conf.src + '/js/pattern-overrider.js';
  var Tasks = require(rootDir + '/core/tasks/tasks');
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
