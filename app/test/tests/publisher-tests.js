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

const ghPagesDir = `${global.workDir}/${pref.gh_pages_src}`;
const publisher = require(`${global.appDir}/core/tasks/publisher`);
const Tasks = require(`${global.appDir}/core/tasks/tasks`);
const tasks = new Tasks();

describe('Publisher', function () {
  // Get array of truncated dirnames.
  var webservedDirs = utils.webservedDirnamesTruncate(pref.backend.webserved_dirs);

  // Run gh-pages-prefixer.js.
  tasks.publish('public', true);

  it('should read a valid .gh_pages_src config', function () {
    expect(pref.gh_pages_src).to.be.a('string');
    expect(pref.gh_pages_src.trim()).to.not.equal('');
  });

  it('should glob the specified patterns directory', function () {
    var files = publisher.filesGet(`${global.workDir}/${conf.ui.paths.public.patterns}`);

    expect(files).to.not.be.empty;
  });

  it('should write to the gh_pages_src directory', function () {
    var files = glob.sync(ghPagesDir + '/*');

    expect(files).to.not.be.empty;
  });

  it('should prefix webserved_dirs with gh_pages_prefix', function () {
    var fileBeforePath = `${global.workDir}/${conf.ui.paths.public.patterns}/00-elements-03-images-00-logo/00-elements-03-images-00-logo.html`;
    var fileBefore = fs.readFileSync(fileBeforePath);
    var fileAfterPath = ghPagesDir + '/00-elements-03-images-00-logo/00-elements-03-images-00-logo.html';

    fs.copySync(fileBeforePath, fileAfterPath);
    publisher.filesProcess('.', [fileAfterPath], webservedDirs, pref.gh_pages_prefix, ghPagesDir);
    var fileAfter = fs.readFileSync(fileAfterPath);

    expect(fileAfter).to.not.equal('');
    expect(fileAfter).to.not.equal(fileBefore);
  });

  it('should copy webserved_dirs to gh_pages_src', function () {
    var pass = true;
    var stats;

    utils.webservedDirsCopy(pref.backend.webserved_dirs, webservedDirs, ghPagesDir);
    for (var i = 0; i < webservedDirs.length; i++) {
      stats = fs.statSync(ghPagesDir + '/' + webservedDirs[i]);
      if (!stats.isDirectory()) {
        pass = false;
        break;
      }
    }

    expect(pass).to.equal(true);
  });
});
