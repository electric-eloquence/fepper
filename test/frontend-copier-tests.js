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
    fs.removeSync(scriptsTargetDir + '-alt/*');
    fs.removeSync(stylesTargetDir + '/fonts/nested/*');
    fs.removeSync(stylesTargetDir + '/fonts/nested-alt/*');
    fs.removeSync(stylesTargetDir + '/fonts/*.*');
    fs.removeSync(stylesTargetDir + '/fonts-alt/*.*');
    fs.removeSync(stylesTargetDir + '/*.*');
    fs.removeSync(stylesTargetDir + '-alt/*.*');

    // Run frontend copier.
    frontendCopier.main(testDir, conf, pref, 'assets');
    frontendCopier.main(testDir, conf, pref, 'scripts');
    frontendCopier.main(testDir, conf, pref, 'styles');

    var assetCopied = fs.statSync(assetsTargetDir + '/logo.png');
    var scriptCopied1 = fs.statSync(scriptsTargetDir + '/fepper-obj.js');
    var scriptCopied2 = fs.statSync(scriptsTargetDir + '/variables.styl');
    var scriptCopied3 = fs.statSync(scriptsTargetDir + '-alt/variables-alt.styl');
    var styleCopied1 = fs.statSync(stylesTargetDir + '/style.css');
    var styleCopied2 = fs.statSync(stylesTargetDir + '-alt/style-alt.css');
    var styleCopied3 = fs.statSync(stylesTargetDir + '/fonts/icons.svg');
    var styleCopied4 = fs.statSync(stylesTargetDir + '/fonts-alt/icons-alt.svg');
    var styleCopied5 = fs.statSync(stylesTargetDir + '/fonts/nested/icons.nested.svg');
    var styleCopied6 = fs.statSync(stylesTargetDir + '/fonts/nested-alt/icons.nested-alt.svg');

    expect(typeof assetCopied).to.equal('object');
    expect(typeof scriptCopied1).to.equal('object');
    expect(typeof scriptCopied2).to.equal('object');
    expect(typeof scriptCopied3).to.equal('object');
    expect(typeof styleCopied1).to.equal('object');
    expect(typeof styleCopied2).to.equal('object');
    expect(typeof styleCopied3).to.equal('object');
    expect(typeof styleCopied4).to.equal('object');
    expect(typeof styleCopied5).to.equal('object');
    expect(typeof styleCopied6).to.equal('object');
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
