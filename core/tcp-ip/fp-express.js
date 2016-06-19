'use strict';

var bodyParser = require('body-parser');
var express = require('express');

var utils = require('../lib/utils');
var conf = utils.conf();
var pref = utils.pref();
var rootDir = utils.rootDir();

var htmlScraper = require('./html-scraper');
var htmlScraperPost = require('./html-scraper-post');
var htmlScraperXhr = require('./html-scraper-xhr');
var MustacheBrowser = require('./mustache-browser');
var mustacheBrowser = new MustacheBrowser(rootDir + '/' + conf.src + '/_patterns', conf);
var readme = require('./readme');
var success = require('./success');

exports.main = function () {
  var app = express();
  var i;
  var webservedDirs;
  var webservedDirSplit;

  // Serve the backend's static files where the document root and top-level
  // directory are set in backend.webserved_dirs in pref.yml.
  if (Array.isArray(pref.backend.webserved_dirs)) {
    webservedDirs = pref.backend.webserved_dirs;
  }

  if (webservedDirs) {
    for (i = 0; i < webservedDirs.length; i++) {
      webservedDirSplit = webservedDirs[i].split('/');
      webservedDirSplit.shift();
      app.use('/' + webservedDirSplit.join('/'), express.static(rootDir + '/backend/' + webservedDirs[i]));
    }
  }

  // So variables sent via form submission can be parsed.
  app.use(bodyParser.urlencoded({extended: true}));

  // HTML scraper form.
  app.get('/html-scraper', htmlScraper.main);

  // HTML scraper AJAX response.
  app.get('/html-scraper-xhr', htmlScraperXhr.main);

  // Mustache browser.
  app.get('/mustache-browser', mustacheBrowser.main());

  // Readme page.
  app.get('/readme', readme.main);

  // Success page.
  app.get('/success', success.main);

  // HTML scraper and importer actions.
  app.post('/html-scraper', htmlScraperPost.main);

  // Fepper static files.
  app.use('/fepper-core', express.static(rootDir + '/core/lib/webserved'));

  // For everything else, document root = Pattern Lab.
  app.use(express.static(rootDir + '/patternlab-node/public'));

  return app;
};
