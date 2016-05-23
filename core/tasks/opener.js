'use strict';

var fs = require('fs-extra');
var open = require('open');

exports.main = function (workDir, conf) {
  var origin = 'http://localhost:' + conf.express_port;
  var log = './install.log';
  var stats;

  try {
    stats = fs.statSync(log);
  }
  catch (err) {
    // Fail gracefully.
  }
  if (stats && stats.isFile()) {
    setTimeout(function () {
      fs.unlink(log);
      open(origin + '/success');
    }, conf.timeout_main * 2);
  }
  else {
    setTimeout(function () {
      return open(origin);
    }, conf.timeout_main);
  }
};
