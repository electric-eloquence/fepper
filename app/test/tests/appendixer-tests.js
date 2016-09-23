'use strict';

const expect = require('chai').expect;
const fs = require('fs-extra');
const path = require('path');

global.appDir = path.normalize(`${__dirname}/../..`);
global.rootDir = path.normalize(`${__dirname}/../../..`);
global.workDir = path.normalize(`${__dirname}/..`);

const utils = require(`${global.appDir}/core/lib/utils`);
utils.conf();
utils.pref();
const conf = global.conf;
const enc = conf.enc;

const appendixFile = `${global.workDir}/${conf.ui.paths.source.root}/_data/_appendix.json`;
const Tasks = require(`${global.appDir}/core/tasks/tasks`);
const tasks = new Tasks();

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
