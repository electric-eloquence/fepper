'use strict';

const bodyParser = require('body-parser');
const express = require('express');

const utils = require('../lib/utils');
const conf = utils.conf();
const pref = utils.pref();

const htmlScraper = require('./html-scraper');
const htmlScraperPost = require('./html-scraper-post');
const htmlScraperXhr = require('./html-scraper-xhr');
const MustacheBrowser = require('./mustache-browser');
const readme = require('./readme');
const success = require('./success');

var mustacheBrowser = new MustacheBrowser(utils.pathResolve(conf.ui.paths.source.patterns));

exports.main = function () {
  var app = express();

  // Serve the backend's static files where the document root and top-level
  // directory are set in backend.webserved_dirs in pref.yml.
  let webservedDirs = null;
  if (Array.isArray(pref.backend.webserved_dirs)) {
    webservedDirs = pref.backend.webserved_dirs;
  }

  if (webservedDirs) {
    for (let i = 0; i < webservedDirs.length; i++) {
      let webservedDirSplit = webservedDirs[i].split('/');
      webservedDirSplit.shift();
      app.use('/' + webservedDirSplit.join('/'), express.static(utils.pathResolve(`backend/${webservedDirs[i]}`)));
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
  app.use('/fepper-core', express.static(`${global.appDir}/core/webserved`));

  // For everything else, document root = Pattern Lab.
  app.use(express.static(utils.pathResolve(conf.ui.paths.public.root)));

  return app;
};
