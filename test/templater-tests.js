(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var path = require('path');
  var yaml = require('js-yaml');

  var utils = require('../fepper/lib/utils');
  var enc = utils.conf().enc;
  var rootDir = utils.rootDir();

  var testDir = rootDir + '/test/files';
  var patternDir = testDir + '/_patterns';
  var srcDir = patternDir + '/03-templates';
  var templater = require(rootDir + '/fepper/tasks/templater');
  var yml = fs.readFileSync(testDir + '/conf/test.conf.yml', enc);
  var conf = yaml.safeLoad(yml);

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
      var code = templater.mustacheRecurse(fileRoot, patternDir);
      var partial = fs.readFileSync(fileFurthest, conf.enc);
      // Should contain fileFurthest.
      expect(code).to.contain(partial);
    });

    it('should strip Mustache tags', function () {
      var tag = '{{> 02-organisms/00-global/00-header.mustache }}';
      var stripped = templater.mustacheStrip(tag);
      expect(stripped).to.not.equal(tag);
      expect(stripped).to.not.contain('{{');
      expect(stripped).to.not.contain('}}');
    });

    it('should unescape Mustache tags', function () {
      var token = '{ tout }';
      var unescaped = templater.mustacheUnescape(token);
      expect(unescaped).to.equal('{\\stout\\s}');
    });

    it('should load tokens', function () {
      var tokens = templater.tokensLoad(srcDir + '/00-homepage.yml');
      expect(tokens).to.not.be.empty;
    });

    it('should write templates', function () {
      var templatesDir = testDir + '/backend/' + conf.backend.synced_dirs.templates_dir;
      var templatesExt = conf.backend.synced_dirs.templates_ext;

      // Clear out templates dir.
      fs.removeSync(templatesDir);

      // Run templating functions.
      var fileRoot = patternDir + '/03-templates/00-homepage.mustache';
      var code = templater.mustacheRecurse(fileRoot, patternDir);
      // Load tokens from YAML file.
      var tokens = templater.tokensLoad(srcDir + '/00-homepage.yml');
      code = templater.tokensReplace(tokens, code);
      templater.templatesWrite(fileRoot, srcDir, templatesDir, templatesExt, code);
    });
  });
})();
