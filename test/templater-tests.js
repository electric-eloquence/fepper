(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var path = require('path');
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
  var srcDir = patternDir + '/03-templates';

  describe('Templater', function () {
    it('should ignore Mustache files prefixed with two undercores', function () {
      var pass = true;
      var files = templater.templatesGlob(srcDir);
      for (var i = 0; i < files.length; i++) {
        if (path.dirname(files[i]).match(/^__/)) {
          pass = false;
          break;
        }
      }
      expect(pass).to.equal(true);
    });

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

    it('should load tokens', function () {
      var tokens = templater.tokensLoad(srcDir + '/00-homepage.yml', conf);
      expect(tokens).to.not.be.empty;
    });

    it('should write templates', function () {
      var templatesDir = testDir + '/backend/' + pref.backend.synced_dirs.templates_dir;
      var templatesExt = pref.backend.synced_dirs.templates_ext;

      // Clear out templates dir.
      fs.removeSync(templatesDir);

      // Run templating functions.
      var fileRoot = srcDir + '/00-homepage.mustache';
      var code = templater.mustacheRecurse(fileRoot, conf, patternDir);
      // Load tokens from YAML file.
      var tokens = templater.tokensLoad(srcDir + '/00-homepage.yml', conf);
      code = templater.tokensReplace(tokens, code, conf, pref);
      templater.templatesWrite(fileRoot, srcDir, templatesDir, templatesExt, code);
    });
  });
})();
