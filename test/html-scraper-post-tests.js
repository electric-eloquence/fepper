(function () {
  'use strict';

  var expect = require('chai').expect;
  var fs = require('fs-extra');

  var utils = require('../fepper/lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();

  var htmlScraperPost = require(rootDir + '/fepper/server/html-scraper-post');
  var req = { body: { target: '', url: '' } };

  describe('HTML Scraper Post', function () {
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
})();
