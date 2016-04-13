(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var yaml = require('js-yaml');

  var utils = require('../core/lib/utils');
  var enc = utils.conf().enc;
  var rootDir = utils.rootDir();

  var staticGenerator = require(rootDir + '/core/tasks/static-generator');
  var confYml = fs.readFileSync(rootDir + '/test/conf.yml', enc);
  var conf = yaml.safeLoad(confYml);
  var prefYml = fs.readFileSync(rootDir + '/test/pref.yml', enc);
  var pref = yaml.safeLoad(prefYml);
  var testDir = rootDir + '/' + conf.test_dir;
  var publicDir = testDir + '/public';
  var staticDir = testDir + '/static';

  describe('Static Generator', function () {
    it('should copy assets to the static dir', function () {
      var assetsDir = staticDir + '/assets';

      // Clear out assets dir.
      fs.removeSync(assetsDir);
      // Get empty stat for comparison.
      var dirExistsBefore = false;
      try {
        dirExistsBefore = fs.statSync(assetsDir).isDirectory();
      }
      catch (err) {
        // Fail gracefully.
      }
      // Copy assets dir.
      staticGenerator.assetsDirCopy(publicDir, staticDir);
      // Stat copied dir.
      var dirExistsAfter = fs.statSync(assetsDir).isDirectory();

      expect(dirExistsBefore).to.equal(false);
      expect(dirExistsAfter).to.not.equal(dirExistsBefore);
    });

    it('should copy scripts to the static dir', function () {
      var scriptsDir = staticDir + '/scripts';

      // Clear out scripts dir.
      fs.removeSync(scriptsDir);
      // Get empty stat for comparison.
      var dirExistsBefore = false;
      try {
        dirExistsBefore = fs.statSync(scriptsDir).isDirectory();
      }
      catch (err) {
        // Fail gracefully.
      }
      // Copy scripts dir.
      staticGenerator.scriptsDirCopy(publicDir, staticDir);
      // Stat copied dir.
      var dirExistsAfter = fs.statSync(scriptsDir).isDirectory();

      expect(dirExistsBefore).to.equal(false);
      expect(dirExistsAfter).to.not.equal(dirExistsBefore);
    });

    it('should copy styles to the static dir', function () {
      var stylesDir = staticDir + '/styles';

      // Clear out styles dir.
      fs.removeSync(stylesDir);
      // Get empty stat for comparison.
      var dirExistsBefore = false;
      try {
        dirExistsBefore = fs.statSync(stylesDir).isDirectory();
      }
      catch (err) {
        // Fail gracefully.
      }
      // Copy styles dir.
      // Run pattern-overrider.js.
      staticGenerator.stylesDirCopy(publicDir, staticDir);
      // Stat copied dir.
      var dirExistsAfter = fs.statSync(stylesDir).isDirectory();

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
      var webservedDirs = utils.webservedDirnamesTruncate(pref.backend.webserved_dirs);

      utils.webservedDirsCopy(pref.backend.webserved_dirs, testDir, webservedDirs, staticDir);
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
