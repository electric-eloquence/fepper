var fs = require('fs');
var pagedown = require('pagedown');

var utils = require('../lib/utils');
var conf = utils.conf();

var htmlObj = require('../lib/html');

module.exports = function (req, res) {
  'use strict';

  fs.readFile(__dirname + '/../../README.md', conf.enc, function(er, dat) {
    var converter = new pagedown.Converter();
    var htmlMd = converter.makeHtml(dat);
    var output = '';
    output += htmlObj.head;
    output += htmlObj.success;
    output += htmlMd + '\n';
    output += '<p>&nbsp;</p>\n';
    output += '<p>&nbsp;</p>\n';
    output += htmlObj.foot;
    output = output.replace('{{ title }}', 'Installation successful!');
    output = output.replace('{{ class }}', 'success');
    output = output.replace(/localhost:9001/g, req.headers.host);
    res.end(output);
  });
};
