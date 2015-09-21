(function () {
  'use strict';

  var htmlObj = require('../lib/html');

  exports.main = function (req, res) {
    var output = '';
    output += htmlObj.head;
    output += '<script src="js/html-scraper-ajax.js"></script>\n';
    output += htmlObj.foot;
    output = output.replace('{{ title }}', 'Fepper HTML Scraper');
    output = output.replace('{{ class }}', 'scraper');
    res.end(output);
  };
})();
