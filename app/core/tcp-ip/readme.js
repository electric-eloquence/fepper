'use strict';

const fs = require('fs');
const marked = require('marked');

const utils = require('../lib/utils');
const conf = global.conf;

const htmlObj = require('../lib/html');

exports.main = function (req, res) {
  fs.readFile(utils.pathResolve('README.md'), conf.enc, function (err, dat) {
    var htmlMd = marked(dat);
    var output = htmlObj.head;

    output += htmlMd + '\n';
    output += htmlObj.foot;
    output = output.replace('{{ title }}', 'Fepper');
    res.end(output);
  });
};
