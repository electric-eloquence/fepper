'use strict';

var expect = require('chai').expect;
var fs = require('fs-extra');
var yaml = require('js-yaml');

var utils = require('../core/lib/utils');
var enc = utils.conf().enc;
var rootDir = utils.rootDir();

var confYml = fs.readFileSync(rootDir + '/test/conf.yml', enc);
var conf = yaml.safeLoad(confYml);
var frontendCopier = require(rootDir + '/core/tasks/frontend-copier');
var prefYml = fs.readFileSync(rootDir + '/test/pref.yml', enc);
var pref = yaml.safeLoad(prefYml);
var testDir = rootDir + '/' + conf.test_dir;
var assetsTargetDir = testDir + '/backend/' + pref.backend.synced_dirs.assets_dir;
var scriptsTargetDir = testDir + '/backend/' + pref.backend.synced_dirs.scripts_dir;
var scriptsTargetAlt = scriptsTargetDir + '-alt';
var stylesTargetDir = testDir + '/backend/' + pref.backend.synced_dirs.styles_dir;

describe('Frontend Copier', function () {
  it('should copy frontend files to the backend', function () {
    // Clear out target dirs.
    fs.removeSync(assetsTargetDir + '/*');
    fs.removeSync(scriptsTargetDir + '/*');
    fs.removeSync(scriptsTargetAlt + '/*');
    fs.removeSync(stylesTargetDir + '/*');

    // Run frontend copier.
    frontendCopier.main(testDir, conf, pref, 'assets', 'assets_dir');
    frontendCopier.main(testDir, conf, pref, 'scripts/*', 'scripts_dir');
    frontendCopier.main(testDir, conf, pref, 'styles', 'styles_dir');

    var assetCopied = fs.statSync(assetsTargetDir + '/logo.png');
    var scriptCopied = fs.statSync(scriptsTargetDir + '/fepper-obj.js');
    var styleCopied = fs.statSync(stylesTargetDir + '/style.css');

    expect(typeof assetCopied).to.equal('object');
    expect(typeof scriptCopied).to.equal('object');
    expect(typeof styleCopied).to.equal('object');
  });

  it('should ignore frontend files prefixed with two undercores', function () {
    var ignored = null;

    try {
      ignored = fs.statSync(assetsTargetDir + '/__ignored.png');
    }
    catch (err) {
      // Do nothing.
    }

    expect(ignored).to.equal(null);
  });

  it('should ignore frontend files in a _nosync directory', function () {
    var ignored = null;

    try {
      ignored = fs.statSync(assetsTargetDir + '/_nosync/nosync.png');
    }
    catch (err) {
      // Do nothing.
    }

    expect(ignored).to.equal(null);
  });

  it('should write to the default target directory', function () {
    var output = fs.readFileSync(scriptsTargetDir + '/variables.styl', conf.enc).trim();

    expect(output).to.equal('bp_lg_max = -1\nbp_lg_min = 1024\nbp_md_min = 768\nbp_sm_min = 480\nbp_xs_min = 0');
  });

  it('should write to the alternate target directory', function () {
    var output = fs.readFileSync(scriptsTargetAlt + '/variables-alt.styl', conf.enc).trim();

    expect(output).to.equal('bp_lg_max = -1\nbp_lg_min = 1024\nbp_md_min = 768\nbp_sm_min = 480\nbp_xs_min = 0');
  });
});
