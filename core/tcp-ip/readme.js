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
    var output = htmlObj.head;

    output += htmlMd + '\n';
    output += htmlObj.foot;
    output = output.replace('{{ title }}', 'Fepper');
    res.end(output);
  });
};
