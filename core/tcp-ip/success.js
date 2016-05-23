'use strict';

var fs = require('fs');
var pagedown = require('pagedown');

var utils = require('../lib/utils');
var conf = utils.conf();

var htmlObj = require('../lib/html');

exports.main = function (req, res) {
  fs.readFile(__dirname + '/../../README.md', conf.enc, function (err, dat) {
    var converter = new pagedown.Converter();
    var htmlMd = converter.makeHtml(dat);
    var output = '';

    output += htmlObj.headWithMsg;
    output += htmlObj.success;
    output += htmlMd + '\n';
    output += '<p>&nbsp;</p>\n';
    output += '<p>&nbsp;</p>\n';
    output += htmlObj.foot;
    output = output.replace('{{ title }}', 'Installation successful!');
    output = output.replace('{{ msg_class }}', 'success');
    output = output.replace('{{ message }}', '<h1>Installation successful!</h1>');
    output = output.replace(/localhost:3000/g, req.headers.host);
    res.end(output);
  });
};
