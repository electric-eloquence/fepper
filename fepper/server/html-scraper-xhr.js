var htmlObj = require('../lib/html');

module.exports = function (req, res) {
  'use strict';

  var i;
  var msg = '';
  var msgType;
  var output = '';
  var target = '';
  var url = '';

  output += '<section>\n';
  output += htmlObj.scraperTitle;
  output += htmlObj.landingBody;
  output += '</section>';
  output = output.replace('{{ url }}', url);
  output = output.replace('{{ target }}', target);
  res.end(output);
};
