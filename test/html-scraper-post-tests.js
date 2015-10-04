(function () {
  'use strict';

  var cheerio = require('cheerio');
  var expect = require('chai').expect;
  var fs = require('fs-extra');

  var utils = require('../fepper/lib/utils');
  var rootDir = utils.rootDir();

  var html = '<html><body><section id="one" class="test">Foo</section><section id="two" class="test">Bar</section><script></script><textarea></textarea></body></html>';
  var $ = cheerio.load(html);
  var htmlScraperPost = require(rootDir + '/fepper/servers/html-scraper-post');
  var req = {body: {target: '', url: ''}};
  var testDir = rootDir + '/test';
  var scrapeDir = testDir + '/_patterns/98-scrape';

  var xhtml = htmlScraperPost.htmlToXhtml(html);
  var dataObj = htmlScraperPost.xhtmlToJsonAndArray(xhtml);
  var jsonForData = htmlScraperPost.dataArrayToJson(dataObj.array);

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
        var selector = '#id_test-0[1]';
        var selectorSplit = htmlScraperPost.targetValidate(selector, null, req);

        expect(selectorSplit[0]).to.equal('#id_test-0');
        expect(selectorSplit[1]).to.equal('1');
      });

      it('should identify the HTML tag with no index', function () {
        var selector = 'h1';
        var selectorSplit = htmlScraperPost.targetValidate(selector, null, req);

        expect(selectorSplit[0]).to.equal('h1');
        expect(selectorSplit[1]).to.equal('');
      });

      it('should identify the CSS id and index', function () {
        var selector = 'h1[2]';
        var selectorSplit = htmlScraperPost.targetValidate(selector, null, req);

        expect(selectorSplit[0]).to.equal('h1');
        expect(selectorSplit[1]).to.equal('2');
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

      it('should get all selectors of a given tagname if given no index', function () {
        var $targetEl = $('section');
        var targetHtmlObj = htmlScraperPost.targetHtmlGet($targetEl, '', $);

        expect(targetHtmlObj.all).to.equal('<section id="one" class="test">Foo</section>\n<section id="two" class="test">Bar</section>\n');
        expect(targetHtmlObj.first).to.equal('<section id="one" class="test">Foo</section>\n');
      });

      it('should get one selector of a given tagname if given an index', function () {
        var $targetEl = $('section');
        var targetHtmlObj = htmlScraperPost.targetHtmlGet($targetEl, 1, $);

        expect(targetHtmlObj.all).to.equal('<section id="two" class="test">Bar</section>\n');
        expect(targetHtmlObj.first).to.equal('<section id="two" class="test">Bar</section>\n');
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
      it('should return a JSON object', function () {
        expect(dataObj.json).to.be.an('object');
        expect(dataObj.json).to.not.be.empty;
      });

      it('should return an array', function () {
        expect(dataObj.array).to.be.an('array');
        expect(dataObj.array).to.not.be.empty;
      });
    });

    describe('Array to JSON Converter', function () {
      it('should return a JSON object', function () {
        expect(jsonForData).to.be.an('object');
        expect(jsonForData.html[0].one_5).to.equal('Foo');
        expect(jsonForData.html[0].test_5).to.equal('Foo');
        expect(jsonForData.html[0].two_6).to.equal('Bar');
        expect(jsonForData.html[0].test_6).to.equal('Bar');
      });
    });

    describe('JSON to Mustache Converter', function () {
      var xhtml = htmlScraperPost.jsonToMustache(dataObj.json);

      it('should return XHTML with Mustache tags', function () {
        expect(xhtml).to.equal('{{# html }}\n  <body>\n    <section id="one" class="test">{{ test_5 }}</section>\n    <section id="two" class="test">{{ test_6 }}</section>\n    <script/>\n    <textarea/>\n  </body>\n{{/ html }}');
      });
    });

    describe('File Writer', function () {
      it('should validate user-submitted filename', function () {
        var isFilenameValid = htmlScraperPost.isFilenameValid;
        var validFilename = '0-test.1_2';
        var invalidChar = '0-test.1_2!';
        var invalidHyphenPrefix = '-0-test.1_2';
        var invalidPeriodPrefix = '.0-test.1_2';
        var invalidUnderscorePrefix = '_0-test.1_2';

        expect(isFilenameValid(validFilename)).to.equal(true);
        expect(isFilenameValid(invalidChar)).to.equal(false);
        expect(isFilenameValid(invalidHyphenPrefix)).to.equal(false);
        expect(isFilenameValid(invalidPeriodPrefix)).to.equal(false);
        expect(isFilenameValid(invalidUnderscorePrefix)).to.equal(false);
      });

      it('should correctly format newlines in file body', function () {
        var xhtml = '{{# html }}\r\n  <body>\r\n    <section id="one" class="test">{{ test_5 }}</section>\r\n    <section id="two" class="test">{{ test_6 }}</section>\r\n    <script/>\r\n    <textarea/>\r\n  </body>\r\n{{/ html }}';

        expect(htmlScraperPost.newlineFormat(xhtml)).to.equal('{{# html }}\n  <body>\n    <section id="one" class="test">{{ test_5 }}</section>\n    <section id="two" class="test">{{ test_6 }}</section>\n    <script/>\n    <textarea/>\n  </body>\n{{/ html }}\n');
      });

      it('should write file to destination', function () {
        var fileHtml = '{{# html }}\n  <body>\n    <section id="one" class="test">{{ test_5 }}</section>\n    <section id="two" class="test">{{ test_6 }}</section>\n    <script/>\n    <textarea/>\n  </body>\n{{/ html }}\n';
        var fileJson = htmlScraperPost.newlineFormat(JSON.stringify(jsonForData, null, 2));
        var fileName = '0-test.1_2';
        var fileFullPath = scrapeDir + '/' + fileName;

        fs.mkdirsSync(scrapeDir);
        fs.writeFileSync(fileFullPath, '');
        var fileBefore = fs.readFileSync(fileFullPath);
        htmlScraperPost.filesWrite(scrapeDir, fileName, fileHtml, fileJson, null);
        var fileAfter = fs.readFileSync(fileFullPath);

        expect(fileAfter).to.not.equal('');
        expect(fileAfter).to.not.equal(fileBefore);
      });
    });
  });
})();
