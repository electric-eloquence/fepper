(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var yaml = require('js-yaml');

  var utils = require('../core/lib/utils');
  var enc = utils.conf().enc;
  var rootDir = utils.rootDir();

  var templater = require(rootDir + '/core/tasks/templater');
  var confYml = fs.readFileSync(rootDir + '/test/conf.yml', enc);
  var conf = yaml.safeLoad(confYml);
  var prefYml = fs.readFileSync(rootDir + '/test/pref.yml', enc);
  var pref = yaml.safeLoad(prefYml);
  var testDir = rootDir + '/' + conf.test_dir;
  var patternDir = testDir + '/' + conf.src + '/_patterns';
  var templatesDir = testDir + '/backend/' + pref.backend.synced_dirs.templates_dir;
  var templatesAlt = templatesDir + '-alt';

  describe('Templater', function () {
    it('should recurse through Mustache partials', function () {
      var fileFurthest = patternDir + '/00-atoms/03-images/00-logo.mustache';
      var fileRoot = patternDir + '/03-templates/00-homepage.mustache';
      var code = templater.mustacheRecurse(fileRoot, conf, patternDir);
      var partial = fs.readFileSync(fileFurthest, conf.enc);

      // Should contain fileFurthest.
      expect(code).to.contain(partial);
    });

    it('should unescape Mustache tags', function () {
      var token = '{ tout }';
      var unescaped = templater.mustacheUnescape(token);

      expect(unescaped).to.equal('{\\stout\\s}');
    });

    it('should write translated templates', function () {
      // Clear out templates dir.
      fs.removeSync(templatesDir + '/*');
      fs.removeSync(templatesAlt + '/*');

      // Run templater.
      templater.main(testDir, conf, pref);

      var templateTranslated = fs.statSync(templatesDir + '/00-homepage.tpl.php');
      var templateTranslatedAlt = fs.statSync(templatesAlt + '/02-templater-alt.twig');

      expect(typeof templateTranslated).to.equal('object');
      expect(typeof templateTranslatedAlt).to.equal('object');
    });

    it('should ignore Mustache files prefixed with two undercores', function () {
      var ignored = null;

      try {
        ignored = fs.statSync(templatesDir + '/__01-blog.tpl.php');
      }
      catch (err) {
        // Do nothing.
      }

      expect(ignored).to.equal(null);
    });

    it('should write to the default templates directory', function () {
      var output = fs.readFileSync(templatesDir + '/00-homepage.tpl.php', conf.enc).trim();

      expect(output).to.equal('<div class="page" id="page"><a href=""><img src="../../assets/logo.png" class="logo" alt="Logo Alt Text" /></a><?php print $page[\'footer\']; ?></div>');
    });

    it('should write to the alternate templates directory', function () {
      var output = fs.readFileSync(templatesAlt + '/02-templater-alt.twig', conf.enc).trim();

      expect(output).to.equal('<p>02-templater-alt.yml overrides "templates_dir" and \'templates_ext\' in pref.yml</p>');
    });
  });
})();
