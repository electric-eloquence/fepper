'use strict';

var expect = require('chai').expect;
var fs = require('fs-extra');
var yaml = require('js-yaml');

var utils = require('../core/lib/utils');
var enc = utils.conf().enc;
var rootDir = utils.rootDir();

var yml = fs.readFileSync(rootDir + '/test/conf.yml', enc);
var conf = yaml.safeLoad(yml);
var testDir = rootDir + '/' + conf.test_dir;
var appendixFile = testDir + '/' + conf.src + '/_data/_appendix.json';
var Tasks = require(rootDir + '/core/tasks/tasks');
var tasks = new Tasks(testDir, conf);

describe('Appendixer', function () {
  // Clear out _appendix.json.
  fs.writeFileSync(appendixFile, '');
  // Get empty string for comparison.
  var appendixBefore = fs.readFileSync(appendixFile, conf.enc);
  // Run appendixer.js.
  tasks.appendix();
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
