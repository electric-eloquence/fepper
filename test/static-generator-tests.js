(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var yaml = require('js-yaml');

  var utils = require('../core/lib/utils');
  var enc = utils.conf().enc;
  var rootDir = utils.rootDir();

  var staticGenerator = require(rootDir + '/core/tasks/static-generator');
  var yml = fs.readFileSync(rootDir + '/test/conf.yml', enc);
  var conf = yaml.safeLoad(yml);
  var testDir = rootDir + '/' + conf.test_dir;
  var publicDir = testDir + '/public';
  var staticDir = testDir + '/static';

  describe('Static Generator', function () {
    it('should copy css to the static dir', function () {
      var cssDir = staticDir + '/css';

      // Clear out css dir.
      fs.removeSync(cssDir);
      // Get empty stat for comparison.
      var dirExistsBefore = false;
      try {
        dirExistsBefore = fs.statSync(cssDir).isDirectory();
      }
      catch (err) {
        // Fail gracefully.
      }
      // Copy css dir.
      staticGenerator.cssDirCopy(publicDir, staticDir);
      // Stat copied dir.
      var dirExistsAfter = fs.statSync(cssDir).isDirectory();

      expect(dirExistsBefore).to.equal(false);
      expect(dirExistsAfter).to.not.equal(dirExistsBefore);
    });

    it('should copy fonts to the static dir', function () {
      var fontsDir = staticDir + '/fonts';

      // Clear out fonts dir.
      fs.removeSync(fontsDir);
      // Get empty stat for comparison.
      var dirExistsBefore = false;
      try {
        dirExistsBefore = fs.statSync(fontsDir).isDirectory();
      }
      catch (err) {
        // Fail gracefully.
      }
      // Copy fonts dir.
      staticGenerator.fontsDirCopy(publicDir, staticDir);
      // Stat copied dir.
      var dirExistsAfter = fs.statSync(fontsDir).isDirectory();

      expect(dirExistsBefore).to.equal(false);
      expect(dirExistsAfter).to.not.equal(dirExistsBefore);
    });

    it('should copy images to the static dir', function () {
      var imagesDir = staticDir + '/images';

      // Clear out images dir.
      fs.removeSync(imagesDir);
      // Get empty stat for comparison.
      var dirExistsBefore = false;
      try {
        dirExistsBefore = fs.statSync(imagesDir).isDirectory();
      }
      catch (err) {
        // Fail gracefully.
      }
      // Copy images dir.
      // Run pattern-overrider.js.
      staticGenerator.imagesDirCopy(publicDir, staticDir);
      // Stat copied dir.
      var dirExistsAfter = fs.statSync(imagesDir).isDirectory();

      expect(dirExistsBefore).to.equal(false);
      expect(dirExistsAfter).to.not.equal(dirExistsBefore);
    });

    it('should copy js to the static dir', function () {
      var jsDir = staticDir + '/js';

      // Clear out js dir.
      fs.removeSync(jsDir);
      // Get empty stat for comparison.
      var dirExistsBefore = false;
      try {
        dirExistsBefore = fs.statSync(jsDir).isDirectory();
      }
      catch (err) {
        // Fail gracefully.
      }
      // Copy js dir.
      staticGenerator.jsDirCopy(publicDir, staticDir);
      // Stat copied dir.
      var dirExistsAfter = fs.statSync(jsDir).isDirectory();

      expect(dirExistsBefore).to.equal(false);
      expect(dirExistsAfter).to.not.equal(dirExistsBefore);
    });

    it('should write static/index.html', function () {
      var testFile = staticDir + '/index.html';

      // Clear out static/index.html.
      fs.writeFileSync(testFile, '');
      // Get empty string for comparison.
      var indexBefore = fs.readFileSync(testFile, conf.enc);
      // Compile pages dir.
      staticGenerator.pagesDirCompile(testDir, conf, publicDir + '/patterns', staticDir);
      // Check test file.
      var indexAfter = fs.readFileSync(testFile, conf.enc);

      expect(indexBefore).to.equal('');
      expect(indexAfter).to.not.equal(indexBefore);
    });

    it('should write static/01-blog.html', function () {
      var testFile = staticDir + '/01-blog.html';

      // Clear out static/index.html.
      fs.writeFileSync(testFile, '');
      // Get empty string for comparison.
      var indexBefore = fs.readFileSync(testFile, conf.enc);
      // Compile pages dir.
      staticGenerator.pagesDirCompile(testDir, conf, publicDir + '/patterns', staticDir);
      // Check test file.
      var indexAfter = fs.readFileSync(testFile, conf.enc);

      expect(indexBefore).to.equal('');
      expect(indexAfter).to.not.equal(indexBefore);
    });

    it('should copy webserved_dirs to the static dir', function () {
      var pass = true;
      var stats;
      // Get array of truncated dirnames.
      var webservedDirs = utils.webservedDirnamesTruncate(conf.backend.webserved_dirs);

      utils.webservedDirsCopy(conf.backend.webserved_dirs, testDir, webservedDirs, staticDir);
      for (var i = 0; i < webservedDirs.length; i++) {
        stats = fs.statSync(staticDir + '/' + webservedDirs[i]);
        if (!stats.isDirectory()) {
          pass = false;
          break;
        }
      }

      expect(pass).to.equal(true);
    });
  });
})();
