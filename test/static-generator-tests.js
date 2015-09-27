(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');

  var utils = require('../fepper/lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();

  var testDir = rootDir + '/test';
  var staticDir = testDir + '/static';
  var staticGenerator = require(rootDir + '/fepper/tasks/static-generator');

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
      staticGenerator.cssDirCopy(testDir, staticDir);
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
      staticGenerator.fontsDirCopy(testDir, staticDir);
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
      staticGenerator.imagesDirCopy(testDir, staticDir);
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
      staticGenerator.jsDirCopy(testDir, staticDir);
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
      staticGenerator.pagesDirCompile(testDir + '/patterns', staticDir);
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
      staticGenerator.pagesDirCompile(testDir + '/patterns', staticDir);
      // Check test file.
      var indexAfter = fs.readFileSync(testFile, conf.enc);

      expect(indexBefore).to.equal('');
      expect(indexAfter).to.not.equal(indexBefore);
    });
  });
})();
