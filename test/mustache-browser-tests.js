(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');
  var yaml = require('js-yaml');

  var utils = require('../core/lib/utils');
  var enc = utils.conf().enc;
  var rootDir = utils.rootDir();

  var yml = fs.readFileSync(rootDir + '/test/conf.yml', enc);
  var conf = yaml.safeLoad(yml);
  var testDir = rootDir + '/' + conf.test_dir;
  var MustacheBrowser = require(rootDir + '/core/tcp-ip/mustache-browser');
  var mustacheBrowser = new MustacheBrowser(testDir + '/' + conf.src + '/_patterns', conf);

  var mustache = '<section id="one" class="test">{{> 02-organisms/00-global/00-header(\'partial?\': true) }}</section><section id="two" class="test">{{> 02-organisms/00-global/01-footer.mustache }}</section><script></script><textarea></textarea></body></html>';
  var htmlEntitiesAndLinks = mustacheBrowser.toHtmlEntitiesAndLinks(mustache);
  var partialTag = '{{> 02-organisms/00-global/00-header(\'partial?\': true) }}';
  var partialPath = mustacheBrowser.partialTagToPath(partialTag);
  var partialTag2 = '{{> 02-organisms/00-global/00-footer.mustache }}';
  var partialPath2 = mustacheBrowser.partialTagToPath(partialTag);

  describe('Mustache Browser', function () {
    it('should replace angle brackets with HTML entities', function () {
      expect(mustache).to.contain('<');
      expect(mustache).to.contain('>');
      expect(mustache).to.not.contain('&lt;');
      expect(mustache).to.not.contain('&gt;');
      expect(htmlEntitiesAndLinks).to.contain('&lt;');
      expect(htmlEntitiesAndLinks).to.contain('&gt;');
      expect(htmlEntitiesAndLinks).to.contain('&gt;');
    });

    it('should link Mustache partials', function () {
      expect(htmlEntitiesAndLinks).to.contain('<a href="');
      expect(htmlEntitiesAndLinks).to.contain('</a>');
      expect(htmlEntitiesAndLinks).to.equal('&lt;section id="one" class="test"&gt;<a href="?partial={{&gt; 02-organisms/00-global/00-header(\'partial?\': true) }}">{{&gt; 02-organisms/00-global/00-header(\'partial?\': true) }}</a>&lt;/section&gt;&lt;section id="two" class="test"&gt;<a href="?partial={{&gt; 02-organisms/00-global/01-footer.mustache }}">{{&gt; 02-organisms/00-global/01-footer.mustache }}</a>&lt;/section&gt;&lt;script&gt;&lt;/script&gt;&lt;textarea&gt;&lt;/textarea&gt;&lt;/body&gt;&lt;/html&gt;');
    });

    it('should strip Mustache tags to get partial path', function () {
      expect(partialTag).to.contain('{{>');
      expect(partialTag).to.contain('}}');
      expect(partialTag).to.contain('(');
      expect(partialTag).to.contain(')');
      expect(partialPath).to.not.contain('{{>');
      expect(partialPath).to.not.contain('}}');
      expect(partialPath).to.not.contain('(');
      expect(partialPath).to.not.contain(')');
      expect(partialPath).to.equal('02-organisms/00-global/00-header.mustache');
    });

    it('should append .mustache extension to end of partials with no extension', function () {
      expect(partialTag).to.not.contain('.mustache');
      expect(partialPath.indexOf('.mustache')).to.equal(partialPath.length - 9);
    });

    it('should not append .mustache extension to end of partials with extension', function () {
      expect(partialTag2).to.contain('.mustache');
      expect(partialPath2.indexOf('.mustache')).to.equal(partialPath.length - 9);
    });
  });
})();
