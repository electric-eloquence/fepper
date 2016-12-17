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
const pref = global.pref;
const enc = conf.enc;

const frontendCopier = require(`${global.appDir}/core/tasks/frontend-copier`);
const assetsDir = utils.pathResolve(conf.ui.paths.source.images);
const assetsTargetDir = utils.backendDirCheck(pref.backend.synced_dirs.assets_dir);
const scriptsTargetDir = utils.backendDirCheck(pref.backend.synced_dirs.scripts_dir);
const scriptsTargetAlt = `${scriptsTargetDir}-alt`;
const stylesBldDir = utils.pathResolve(conf.ui.paths.source.cssBld);
const stylesTargetDir = utils.backendDirCheck(pref.backend.synced_dirs.styles_dir);
const testDir = global.workDir;

// Clear out target dirs before main execution.
fs.removeSync(assetsTargetDir + '/*');
fs.removeSync(scriptsTargetDir + '/*');
fs.removeSync(scriptsTargetDir + '-alt/*');
fs.removeSync(stylesTargetDir + '/fonts/nested/*');
fs.removeSync(stylesTargetDir + '/fonts/nested-alt/*');
fs.removeSync(stylesTargetDir + '/fonts/*.*');
fs.removeSync(stylesTargetDir + '/fonts-alt/*.*');
fs.removeSync(stylesTargetDir + '/*.*');
fs.removeSync(stylesTargetDir + '-alt/*.*');

// Run main execution before tests.
frontendCopier.main('assets');
frontendCopier.main('scripts');
frontendCopier.main('styles');

describe('Frontend Copier', function () {
  it('should copy frontend files to the backend', function () {
    var assetCopied = fs.existsSync(`${assetsTargetDir}/logo.png`);
    var scriptCopied = fs.existsSync(`${scriptsTargetDir}/src/fepper-obj.js`);
    var scriptCopied1 = fs.existsSync(`${scriptsTargetDir}/src/variables.styl`);
    var scriptCopied2 = fs.existsSync(`${scriptsTargetDir}-alt/variables-alt.styl`);
    var styleCopied = fs.existsSync(`${stylesTargetDir}/bld/style.css`);
    var styleCopied1 = fs.existsSync(`${stylesTargetDir}-alt/style-alt.css`);
    var styleCopied2 = fs.existsSync(`${stylesTargetDir}/bld/fonts/icons.svg`);
    var styleCopied3 = fs.existsSync(`${stylesTargetDir}/fonts-alt/icons-alt.svg`);
    var styleCopied4 = fs.existsSync(`${stylesTargetDir}/bld/fonts/nested/icons.nested.svg`);
    var styleCopied5 = fs.existsSync(`${stylesTargetDir}/fonts-alt/nested-alt/icons.nested-alt.svg`);

    expect(assetCopied).to.equal(true);
    expect(scriptCopied).to.equal(true);
    expect(scriptCopied1).to.equal(true);
    expect(scriptCopied2).to.equal(true);
    expect(styleCopied).to.equal(true);
    expect(styleCopied1).to.equal(true);
    expect(styleCopied2).to.equal(true);
    expect(styleCopied3).to.equal(true);
    expect(styleCopied4).to.equal(true);
    expect(styleCopied5).to.equal(true);
  });

  it('should ignore frontend files prefixed with two undercores', function () {
    var src = fs.existsSync(`${stylesBldDir}/__style.dev.css`);
    var ignored = fs.existsSync(`${stylesTargetDir}/__style.dev.css`);

    expect(src).to.equal(true);
    expect(ignored).to.equal(false);
  });

  it('should ignore frontend files in a _nosync directory', function () {
    var src = fs.existsSync(`${assetsDir}/_nosync/nosync.png`);
    var ignored = fs.existsSync(`${assetsTargetDir}/_nosync/nosync.png`);

    expect(src).to.equal(true);
    expect(ignored).to.equal(false);
  });

  it('should write to the default target directory', function () {
    var output = fs.readFileSync(`${scriptsTargetDir}/src/variables.styl`, conf.enc).trim();

    expect(output).to.equal('bp_lg_max = -1\nbp_lg_min = 1024\nbp_md_min = 768\nbp_sm_min = 480\nbp_xs_min = 0');
  });

  it('should write to the alternate target directory', function () {
    var output = fs.readFileSync(scriptsTargetAlt + '/variables-alt.styl', conf.enc).trim();

    expect(output).to.equal('bp_lg_max = -1\nbp_lg_min = 1024\nbp_md_min = 768\nbp_sm_min = 480\nbp_xs_min = 0');
  });
});
