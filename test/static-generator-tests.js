(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var path = require('path');

  var utils = require('../fepper/lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();

  var staticDir = rootDir + '/' + conf.src+ '/static';
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
      // Run pattern-overrider.js.
      staticGenerator.cssDirCopy();
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
      // Run pattern-overrider.js.
      staticGenerator.fontsDirCopy();
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
      // Run pattern-overrider.js.
      staticGenerator.imagesDirCopy();
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
      // Run pattern-overrider.js.
      staticGenerator.jsDirCopy();
      // Stat copied dir.
      var dirExistsAfter = fs.statSync(jsDir).isDirectory();

      expect(dirExistsBefore).to.equal(false);
      expect(dirExistsAfter).to.not.equal(dirExistsBefore);
    });

    it('should overwrite static/index.html', function () {
      var indexFile = staticDir + '/index.html';
  
      // Clear out static/index.html.
      fs.writeFileSync(indexFile, '');
      // Get empty string for comparison.
      var indexBefore = fs.readFileSync(indexFile, conf.enc);
      // Run pattern-overrider.js.
      staticGenerator.pagesDirCompile();
      // Get pattern-overrider.js output.
      var indexAfter = fs.readFileSync(indexFile, conf.enc);

      expect(indexBefore).to.equal('');
      expect(indexAfter).to.not.equal(indexBefore);
    });
  });
})();
