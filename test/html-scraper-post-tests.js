(function () {
  'use strict';

  var cheerio = require('cheerio');
  var expect = require('chai').expect;
  var fs = require('fs-extra');

  var utils = require('../fepper/lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();

  var html = '<html><body><section id="one" class="test">Foo</section><section id="two" class="test">Bar</section><script></script><textarea></textarea></body></html>';
  var $ = cheerio.load(html);
  var htmlScraperPost = require(rootDir + '/fepper/server/html-scraper-post');
  var req = { body: { target: '', url: '' } };

  describe('HTML Scraper Post', function () {
    describe('CSS Selector Validator', function () {
      it('should identify the CSS class with no index', function () {
        var selector = '.class_test-0';
        var selectorSplit = htmlScraperPost.targetValidate(selector, null, req);

        expect(selectorSplit[0]).to.equal('.class_test-0');
        expect(selectorSplit[1]).to.equal('');
      });

      it('should identify the CSS class and index', function () {
        var selector = '.class_test-0[0]';
        var selectorSplit = htmlScraperPost.targetValidate(selector, null, req);

        expect(selectorSplit[0]).to.equal('.class_test-0');
        expect(selectorSplit[1]).to.equal('0');
      });

      it('should identify the CSS id with no index', function () {
        var selector = '#id_test-0';
        var selectorSplit = htmlScraperPost.targetValidate(selector, null, req);

        expect(selectorSplit[0]).to.equal('#id_test-0');
        expect(selectorSplit[1]).to.equal('');
      });

      it('should identify the CSS id and index', function () {
        var selector = '#id_test-0[0]';
        var selectorSplit = htmlScraperPost.targetValidate(selector, null, req);

        expect(selectorSplit[0]).to.equal('#id_test-0');
        expect(selectorSplit[1]).to.equal('0');
      });
    });

    describe('Target HTML Getter', function () {
      it('should get all selectors of a given class if given no index', function () {
        var $targetEl = $('.test');
        var targetHtmlObj = htmlScraperPost.targetHtmlGet($targetEl, '', $);

        expect(targetHtmlObj.all).to.equal('<section id="one" class="test">Foo</section>\n<section id="two" class="test">Bar</section>\n');
        expect(targetHtmlObj.first).to.equal('<section id="one" class="test">Foo</section>\n');
      });

      it('should get one selector of a given class if given an index', function () {
        var $targetEl = $('.test');
        var targetHtmlObj = htmlScraperPost.targetHtmlGet($targetEl, 1, $);

        expect(targetHtmlObj.all).to.equal('<section id="two" class="test">Bar</section>\n');
        expect(targetHtmlObj.first).to.equal('<section id="two" class="test">Bar</section>\n');
      });

      it('should get one selector of a given id', function () {
        var $targetEl = $('#one');
        var targetHtmlObj = htmlScraperPost.targetHtmlGet($targetEl, '', $);

        expect(targetHtmlObj.all).to.equal('<section id="one" class="test">Foo</section>\n');
        expect(targetHtmlObj.first).to.equal('<section id="one" class="test">Foo</section>\n');
      });
    });

    describe('HTML Sanitizer', function () {
      var htmlSan = htmlScraperPost.htmlSanitize(html);

      it('should replace script tags with code tags', function () {
        expect(htmlSan).to.equal('<html><body><section id="one" class="test">Foo</section><section id="two" class="test">Bar</section><code></code><figure></figure></body></html>');
        expect(html).to.contain('script');
        expect(html).to.not.contain('code');
        expect(htmlSan).to.not.contain('script');
        expect(htmlSan).to.contain('code');
      });

      it('should replace textarea tags with figure tags', function () {
        expect(html).to.contain('textarea');
        expect(html).to.not.contain('figure');
        expect(htmlSan).to.not.contain('textarea');
        expect(htmlSan).to.contain('figure');
      });
    });

    describe('HTML Converter', function () {
      var xhtml = htmlScraperPost.htmlToXhtml(html);
      var dataObj = htmlScraperPost.xhtmlToJsonAndArray(xhtml);

      it('should return a JSON object', function () {
        expect(dataObj.json).to.be.an('object');
        expect(dataObj.json).to.not.be.empty;
      });

      it('should return an array', function () {
        expect(dataObj.array).to.be.an('array');
        expect(dataObj.array).to.not.be.empty;
      });
    });
  });
})();
