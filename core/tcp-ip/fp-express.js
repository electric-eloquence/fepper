(function () {
  'use strict';

  var bodyParser = require('body-parser');
  var express = require('express');

  var utils = require('../lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir();
  var dataJson = utils.data(rootDir, conf);

  var htmlScraper = require('./html-scraper');
  var htmlScraperPost = require('./html-scraper-post');
  var htmlScraperXhr = require('./html-scraper-xhr');
  var MustacheBrowser = require('./mustache-browser');
  var mustacheBrowser = new MustacheBrowser(rootDir + '/' + conf.src + '/_patterns', conf);
  var success = require('./success');

  exports.main = function () {
    var app = express();
    var i;
    var webservedDirs;
    var webservedDirSplit;

    // Serve the backend's static files where the document root and top-level
    // directory are set in backend.webserved_dirs in conf.yml or backend_webserved_dirs
    // in data.json.

    // First check if backend.webserved_dirs is set in conf.yml. This takes
    // priority over backend_webserved_dirs in data.json. The data.json setting
    // can be version controlled, while the conf.yml setting can override the
    // version controlled setting for local-specific exceptions.
    if (conf.backend.webserved_dirs.constructor === Array) {
      webservedDirs = conf.backend.webserved_dirs;
    }
    else if (dataJson.backend_webserved_dirs.constructor === Array) {
      webservedDirs = dataJson.backend_webserved_dirs;
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

    // Success page.
    app.get('/success', success.main);

    // HTML scraper and importer actions.
    app.post('/html-scraper', htmlScraperPost.main);

    // For everything else, document root = Pattern Lab.
    app.use(express.static(rootDir + '/patternlab-node/public'));

    return app;
  };
})();
