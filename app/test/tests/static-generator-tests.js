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
const pref = global.pref;
const enc = conf.enc;

const staticGenerator = require(`${global.appDir}/core/tasks/static-generator`);

const patternsDir = `${global.workDir}/${conf.ui.paths.source.patterns}`;
const staticDir = path.normalize(`${global.workDir}/${conf.ui.paths.source.root}/static`);

const assetsSrc = path.normalize(`${global.workDir}/${conf.ui.paths.source.images}`);
const scriptsSrc = path.normalize(`${global.workDir}/${conf.ui.paths.source.js}`);
const stylesSrc = path.normalize(`${global.workDir}/${conf.ui.paths.source.css}`);

describe('Static Generator', function () {
  it('should copy assets to the static dir', function () {
    var assetsDir = `${staticDir}/_assets`;

    // Clear out test dir.
    fs.removeSync(assetsDir);

    // Check that test dir doesn't exist at beginning of test.
    var existsBefore = fs.existsSync(assetsDir);

    // Copy test dir.
    staticGenerator.assetsDirCopy();

    // Compare src and dest by converting their glob arrays to strings
    var globSrc = glob.sync(assetsSrc + '/**');
    var globDest = glob.sync(assetsDir + '/**');
    for (let i = 0; i < globSrc.length; i++) {
      globSrc[i] = globSrc[i].replace(assetsSrc, '');
    }
    for (let i = 0; i < globDest.length; i++) {
      globDest[i] = globDest[i].replace(assetsDir, '');
    }
    var globStrSrc = globSrc.toString();
    var globStrDest = globDest.toString();

    // Test expectations.
    expect(existsBefore).to.equal(false);
    expect(globStrSrc).to.equal(globStrDest);
  });

  it('should copy scripts nested one or more dirs below the scripts dir to the static dir', function () {
    var scriptsDir = `${staticDir}/_scripts`;

    // Clear out test dir.
    fs.removeSync(scriptsDir);

    // Check that test dir doesn't exist at beginning of test.
    var existsBefore = fs.existsSync(scriptsDir);

    // Copy test dir.
    staticGenerator.scriptsDirCopy();

    // Compare src and dest by converting their glob arrays to strings
    var globSrc = glob.sync(scriptsSrc + '/*/**');
    var globDest = glob.sync(scriptsDir + '/*/**');
    for (let i = 0; i < globSrc.length; i++) {
      globSrc[i] = globSrc[i].replace(scriptsSrc, '');
    }
    for (let i = 0; i < globDest.length; i++) {
      globDest[i] = globDest[i].replace(scriptsDir, '');
    }
    var globStrSrc = globSrc.toString();
    var globStrDest = globDest.toString();

    // Test expectations.
    expect(existsBefore).to.equal(false);
    expect(globStrSrc).to.equal(globStrDest);
  });

  it('should not copy scripts at the root level of the scripts dir to the static dir', function () {
    var scriptsDir = `${staticDir}/_scripts`;
    var testFile = 'patternlab-only.js';

    // Copy test dir if previous test didn't already do so.
    if (!fs.existsSync(scriptsDir)) {
      staticGenerator.scriptsDirCopy();
    }

    // Test expectations.
    expect(fs.existsSync(`${scriptsSrc}/${testFile}`)).to.equal(true);
    expect(fs.existsSync(`${scriptsDir}/${testFile}`)).to.equal(false);
  });

  it('should copy styles to the static dir', function () {
    var stylesDir = `${staticDir}/_styles`;

    // Clear out test dir.
    fs.removeSync(stylesDir);

    // Check that test dir doesn't exist at beginning of test.
    var existsBefore = fs.existsSync(stylesDir);

    // Copy test dir.
    staticGenerator.stylesDirCopy();

    // Compare src and dest by converting their glob arrays to strings
    var globSrc = glob.sync(stylesSrc + '/**');
    var globDest = glob.sync(stylesDir + '/**');
    for (let i = 0; i < globSrc.length; i++) {
      globSrc[i] = globSrc[i].replace(stylesSrc, '');
    }
    for (let i = 0; i < globDest.length; i++) {
      globDest[i] = globDest[i].replace(stylesDir, '');
    }
    var globStrSrc = globSrc.toString();
    var globStrDest = globDest.toString();

    // Test expectations.
    expect(existsBefore).to.equal(false);
    expect(globStrSrc).to.equal(globStrDest);
  });

  it('should write static/index.html', function () {
    var testFile = `${staticDir}/index.html`;

    // Clear out test file.
    fs.removeSync(testFile);

    // Check that test file doesn't exist at beginning of test.
    var existsBefore = fs.existsSync(testFile);

    // Compile pages dir.
    staticGenerator.pagesDirCompile();

    // Check test file.
    var content = fs.readFileSync(testFile, conf.enc);

    // Test expectations.
    expect(existsBefore).to.equal(false);
    expect(content).to.not.equal('');
  });

  it('should write static/01-blog.html', function () {
    var testFile = `${staticDir}/01-blog.html`;

    // Clear out test file.
    fs.removeSync(testFile);

    // Check that test file doesn't exist at beginning of test.
    var existsBefore = fs.existsSync(testFile);

    // Compile pages dir.
    staticGenerator.pagesDirCompile();

    // Check test file.
    var content = fs.readFileSync(testFile, conf.enc);

    // Test expectations.
    expect(existsBefore).to.equal(false);
    expect(content).to.not.equal('');
  });

  it('should copy webserved_dirs to the static dir', function () {
    var pass = true;
    var stats;
    // Get array of truncated dirnames.
    var webservedDirs = utils.webservedDirnamesTruncate(pref.backend.webserved_dirs);

    // Run copy operation.
    utils.webservedDirsCopy(pref.backend.webserved_dirs, webservedDirs, staticDir);
    for (var i = 0; i < webservedDirs.length; i++) {
      stats = fs.statSync(staticDir + '/' + webservedDirs[i]);
      if (!stats.isDirectory()) {
        pass = false;
        break;
      }
    }

    // Test expectations.
    expect(pass).to.equal(true);
  });
});
