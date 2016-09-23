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

const poFile = `${global.workDir}/${conf.ui.paths.public.js}/pattern-overrider.js`;
const Tasks = require(`${global.appDir}/core/tasks/tasks`);
const tasks = new Tasks();

describe('Pattern Overrider', function () {
  // Clear out pattern-overrider.js.
  fs.mkdirpSync(path.dirname(poFile));
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
