'use strict';

const cheerio = require('cheerio');
const expect = require('chai').expect;
const fs = require('fs-extra');
const path = require('path');

global.appDir = path.normalize(`${__dirname}/../..`);
global.rootDir = path.normalize(`${__dirname}/../../..`);
global.workDir = path.normalize(`${__dirname}/..`);

const utils = require('../../core/lib/utils');
utils.conf();
utils.pref();
const conf = global.conf;
const enc = conf.enc;

const htmlScraperPost = require(`${global.appDir}/core/tcp-ip/html-scraper-post`);
const req = {body: {target: '', url: ''}};
const scrapeDir = `${global.workDir}/${conf.ui.paths.source.patterns}/_patterns/98-scrape`;

const html = `
<body>
<section id="one" class="test">Foo</section>
<section id="two" class="test">Bar</section>
<section class="test">Foot</section>
<section class="test">Barf</section>
<section class="test">Bazm</section>
<section>Fooz</section>
<section>Barz</section>
<section>Bazz</section>
<script></script>
<br>
<div></div>
<p></p>
<textarea></textarea>
<!-- comment -->
</body>
`;
const jsons = htmlScraperPost.htmlToJsons(html);
const $ = cheerio.load(html);

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

      expect(targetHtmlObj.all).to.equal(`<section id="one" class="test">Foo</section>
<!-- BEGIN ARRAY ELEMENT 1 -->
<section id="two" class="test">Bar</section>
<!-- BEGIN ARRAY ELEMENT 2 -->
<section class="test">Foot</section>
<!-- BEGIN ARRAY ELEMENT 3 -->
<section class="test">Barf</section>
<!-- BEGIN ARRAY ELEMENT 4 -->
<section class="test">Bazm</section>
`);
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

      expect(targetHtmlObj.all).to.equal(`<section id="one" class="test">Foo</section>
<!-- BEGIN ARRAY ELEMENT 1 -->
<section id="two" class="test">Bar</section>
<!-- BEGIN ARRAY ELEMENT 2 -->
<section class="test">Foot</section>
<!-- BEGIN ARRAY ELEMENT 3 -->
<section class="test">Barf</section>
<!-- BEGIN ARRAY ELEMENT 4 -->
<section class="test">Bazm</section>
<!-- BEGIN ARRAY ELEMENT 5 -->
<section>Fooz</section>
<!-- BEGIN ARRAY ELEMENT 6 -->
<section>Barz</section>
<!-- BEGIN ARRAY ELEMENT 7 -->
<section>Bazz</section>
`);
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
      expect(htmlSan).to.equal(`
<body>
<section id="one" class="test">Foo</section>
<section id="two" class="test">Bar</section>
<section class="test">Foot</section>
<section class="test">Barf</section>
<section class="test">Bazm</section>
<section>Fooz</section>
<section>Barz</section>
<section>Bazz</section>
<code></code>
<br>
<div></div>
<p></p>
<figure></figure>
<!-- comment -->
</body>
`);
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
      expect(jsons.jsonForMustache).to.be.an('object');
      expect(jsons.jsonForMustache).to.not.be.empty;
    });

    it('should return an array', function () {
      expect(jsons.jsonForData).to.be.an('object');
      expect(jsons.jsonForData).to.not.be.empty;
    });
  });

  describe('Array to JSON Converter', function () {
    it('should return a JSON object of data pulled from non-empty elements', function () {
      expect(jsons.jsonForData).to.be.an('object');
      expect(jsons.jsonForData.html[0].one).to.equal('Foo');
      expect(jsons.jsonForData.html[0].two).to.equal('Bar');
      expect(jsons.jsonForData.html[0].test).to.equal('Foot');
      expect(jsons.jsonForData.html[0].test_1).to.equal('Barf');
      expect(jsons.jsonForData.html[0].test_2).to.equal('Bazm');
      expect(jsons.jsonForData.html[0].section).to.equal('Fooz');
      expect(jsons.jsonForData.html[0].section_1).to.equal('Barz');
      expect(jsons.jsonForData.html[0].section_2).to.equal('Bazz');
      expect(typeof jsons.jsonForData.html[0].body).to.equal('undefined');
      expect(typeof jsons.jsonForData.html[0].script).to.equal('undefined');
      expect(typeof jsons.jsonForData.html[0].br).to.equal('undefined');
      expect(typeof jsons.jsonForData.html[0].div).to.equal('undefined');
      expect(typeof jsons.jsonForData.html[0].p).to.equal('undefined');
      expect(typeof jsons.jsonForData.html[0].textarea).to.equal('undefined');
    });

    it('should create multiple array elements when the selector targets multiple DOM elements', function () {
      var html = `
<section class="test">Foo</section>
<section class="test">Bar</section>
<section class="test">Foot</section>
<section class="test">Barf</section>
<section class="test">Bazm</section>
`;
      var $ = cheerio.load(html);
      var $targetEl = $('.test');
      var targetHtmlObj = htmlScraperPost.targetHtmlGet($targetEl, '', $);
      var targetHtml = htmlScraperPost.htmlSanitize(targetHtmlObj.all);
      var jsonForData = htmlScraperPost.htmlToJsons(targetHtml).jsonForData;

      expect(jsonForData).to.be.an('object');
      expect(jsonForData.html[0].test).to.equal('Foo');
      expect(jsonForData.html[1].test).to.equal('Bar');
      expect(jsonForData.html[2].test).to.equal('Foot');
      expect(jsonForData.html[3].test).to.equal('Barf');
      expect(jsonForData.html[4].test).to.equal('Bazm');
    });
  });

  describe('JSON to Mustache Converter', function () {
    it('should return HTML with Mustache tags', function () {
      var mustache;

      mustache = htmlScraperPost.jsonToMustache(jsons.jsonForMustache);
      expect(mustache).to.equal(`{{# html }}

  <body>
    <section id="one" class="test">{{ one }}</section>
    <section id="two" class="test">{{ two }}</section>
    <section class="test">{{ test }}</section>
    <section class="test">{{ test_1 }}</section>
    <section class="test">{{ test_2 }}</section>
    <section>{{ section }}</section>
    <section>{{ section_1 }}</section>
    <section>{{ section_2 }}</section>
    <script></script>
    <br/>
    <div></div>
    <p></p>
    <textarea></textarea>
    <!-- comment -->
  </body>
{{/ html }}
`);
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
      var mustache = '{{# html }}\r\n  <body>\r\n    <section id="one" class="test">{{ test_5 }}</section>\r\n    <section id="two" class="test">{{ test_6 }}</section>\r\n    <script/>\r\n    <textarea/>\r\n  </body>\r\n{{/ html }}';

      expect(htmlScraperPost.newlineFormat(mustache)).to.equal('{{# html }}\n  <body>\n    <section id="one" class="test">{{ test_5 }}</section>\n    <section id="two" class="test">{{ test_6 }}</section>\n    <script/>\n    <textarea/>\n  </body>\n{{/ html }}\n');
    });

    it('should write file to destination', function () {
      var fileMustache = '{{# html }}\n  <body>\n    <section id="one" class="test">{{ test_5 }}</section>\n    <section id="two" class="test">{{ test_6 }}</section>\n    <script/>\n    <textarea/>\n  </body>\n{{/ html }}\n';
      var fileJson = htmlScraperPost.newlineFormat(JSON.stringify(jsons.jsonForData, null, 2));
      var fileName = '0-test.1_2';
      var fileFullPath = scrapeDir + '/' + fileName;

      fs.mkdirpSync(scrapeDir);
      fs.writeFileSync(fileFullPath, '');
      var fileBefore = fs.readFileSync(fileFullPath);
      htmlScraperPost.filesWrite(scrapeDir, fileName, fileMustache, fileJson, null);
      var fileAfter = fs.readFileSync(fileFullPath);

      expect(fileAfter).to.not.equal('');
      expect(fileAfter).to.not.equal(fileBefore);
    });
  });
});
