'use strict';

const expect = require('chai').expect;
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

global.appDir = path.normalize(`${__dirname}/../..`);
global.rootDir = path.normalize(`${__dirname}/../../..`);
global.workDir = path.normalize(`${__dirname}/..`);

const utils = require(`${global.appDir}/core/lib/utils`);
utils.conf();
utils.pref();
const conf = global.conf;
const enc = conf.enc;

//const testDir = rootDir + '/' + conf.test_dir;
const appendixFile = `${global.workDir}/${conf.ui.paths.source.data}/_appendix.json`;
const dataFile = `${global.workDir}/${conf.ui.paths.source.data}/data.json`;
const Tasks = require(`${global.appDir}/core/tasks/tasks`);
const tasks = new Tasks();

describe('JSON Compiler', function () {
  // Clear out data.json.
  fs.writeFileSync(dataFile, '');
  // Get empty string for comparison.
  var dataBefore = fs.readFileSync(dataFile, conf.enc);
  // Run json-compiler.js.
  tasks.jsonCompile(`${global.workDir}/${conf.ui.paths.source.root}`);
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
    var _data = stripBraces(fs.readFileSync(`${global.workDir}/${conf.ui.paths.source.data}/_data.json`, conf.enc));
    expect(dataAfter).to.contain(_data);
  });

  it('should compile _patterns partials to data.json', function () {
    var partial;
    var partials = glob.sync(`${global.workDir}/${conf.ui.paths.source.patterns}/**/_*.json`);
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
