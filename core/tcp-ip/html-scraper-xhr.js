(function () {
  'use strict';

  var htmlObj = require('../lib/html');

  exports.main = function (req, res) {
    var output = '';
    var target = '';
    var url = '';

    output += '<section>\n';
    output += htmlObj.scraperTitle;
    output += htmlObj.landingBody;
    output += '</section>';
    output = output.replace('{{ attributes }}', ' target="_blank"');
    output = output.replace('{{ url }}', url);
    output = output.replace('{{ target }}', target);
    res.end(output);
  };
})();
