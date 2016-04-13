(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var glob = require('glob');
  var yaml = require('js-yaml');

  var utils = require('../core/lib/utils');
  var enc = utils.conf().enc;
  var rootDir = utils.rootDir();

  var confYml = fs.readFileSync(rootDir + '/test/conf.yml', enc);
  var conf = yaml.safeLoad(confYml);
  var prefYml = fs.readFileSync(rootDir + '/test/pref.yml', enc);
  var pref = yaml.safeLoad(prefYml);
  var testDir = rootDir + '/' + conf.test_dir;
  var ghPagesDir = testDir + '/' + pref.gh_pages_src;
  var publisher = require(rootDir + '/core/tasks/publisher');
  var Tasks = require(rootDir + '/core/tasks/tasks');
  var tasks = new Tasks(testDir, conf);

  describe('Publisher', function () {
    // Get array of truncated dirnames.
    var webservedDirs = utils.webservedDirnamesTruncate(pref.backend.webserved_dirs);

    // Clear out gh_pages_src dir.
    fs.removeSync(ghPagesDir);
    // Run gh-pages-prefixer.js.
    tasks.publish(testDir + '/.publish', pref, true);

    it('should read a valid .gh_pages_src config', function () {
      expect(pref.gh_pages_src).to.be.a('string');
      expect(pref.gh_pages_src.trim()).to.not.equal('');
    });

    it('should glob the specified patterns directory', function () {
      var files = publisher.filesGet(testDir + '/' + conf.pub + '/patterns');

      expect(files).to.not.be.empty;
    });

    it('should write to the gh_pages_src directory', function () {
      var files = glob.sync(ghPagesDir + '/*');

      expect(files).to.not.be.empty;
    });

    it('should prefix webserved_dirs with gh_pages_prefix', function () {
      var fileBeforePath = testDir + '/' + conf.pub + '/patterns/00-atoms-03-images-00-logo/00-atoms-03-images-00-logo.html';
      var fileBefore = fs.readFileSync(fileBeforePath);
      var fileAfterPath = ghPagesDir + '/00-atoms-03-images-00-logo/00-atoms-03-images-00-logo.html';

      fs.copySync(fileBeforePath, fileAfterPath);
      publisher.filesProcess([fileAfterPath], conf, webservedDirs, pref.gh_pages_prefix, testDir, testDir);
      var fileAfter = fs.readFileSync(fileAfterPath);

      expect(fileAfter).to.not.equal('');
      expect(fileAfter).to.not.equal(fileBefore);
    });

    it('should copy webserved_dirs to gh_pages_src', function () {
      var pass = true;
      var stats;

      utils.webservedDirsCopy(pref.backend.webserved_dirs, testDir, webservedDirs, ghPagesDir);
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
