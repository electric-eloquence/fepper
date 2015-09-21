(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var glob = require('glob');
  var yaml = require('js-yaml');

  var utils = require('../fepper/lib/utils');
  var enc = utils.conf().enc;
  var rootDir = utils.rootDir();

  var testDir = rootDir + '/test';
  var yml = fs.readFileSync(testDir + '/conf/conf.yml', enc);
  var conf = yaml.safeLoad(yml);
  var ghPagesDir = rootDir + '/' + conf.gh_pages_src;
  var ghPagesPrefixer = require(rootDir + '/fepper/tasks/gh-pages-prefixer');

  describe('GitHub Pages Prefixer', function () {
    // Get array of truncated dirnames.
    var webservedDirs = ghPagesPrefixer.webservedDirnamesTruncate(conf.backend.webserved_dirs);
    // Clear out gh_pages_src dir.
    fs.removeSync(ghPagesDir);
    // Run gh-pages-prefixer.js.
    ghPagesPrefixer.main();

    it('should read a valid .gh_pages_src config', function () {
      expect(conf.gh_pages_src).to.be.a('string');
      expect(conf.gh_pages_src.trim()).to.not.equal('');
    });

    it('should glob the specified patterns directory', function () {
      var files = ghPagesPrefixer.filesGet(testDir + '/patterns');
      expect(files).to.not.be.empty;
    });

    it('should write to the gh_pages_src directory', function () {
      var files = glob.sync(ghPagesDir + '/*');
      expect(files).to.not.be.empty;
    });

    it('should prefix webserved_dirs with gh_pages_prefix', function () {
      var fileBeforePath = testDir + '/patterns/00-logo.html';
      var fileBefore = fs.readFileSync(fileBeforePath);
      var fileAfterPath = ghPagesDir + '/00-logo.html';
      fs.copySync(fileBeforePath, fileAfterPath);
      ghPagesPrefixer.filesProcess([fileAfterPath], conf, webservedDirs, conf.gh_pages_prefix);
      var fileAfter = fs.readFileSync(fileAfterPath);
      expect(fileAfter).to.not.equal('');
      expect(fileAfter).to.not.equal(fileBefore);
    });

    it('should copy webserved_dirs to gh_pages_src', function () {
      var pass = true;
      var stats;
      ghPagesPrefixer.webservedDirsCopy(conf.backend.webserved_dirs, testDir, webservedDirs, ghPagesDir);
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
})();
