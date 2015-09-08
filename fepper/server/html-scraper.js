var htmlObj = require('../lib/html');

module.exports = function (req, res) {
  'use strict';

  var output = '';
  output += htmlObj.head;
  output += '<script src="js/html-scraper-ajax.js"></script>\n';
  output += htmlObj.foot;
  output = output.replace('{{ title }}', 'Fepper HTML Scraper');
  output = output.replace('{{ class }}', 'scraper');
  res.end(output);
};
