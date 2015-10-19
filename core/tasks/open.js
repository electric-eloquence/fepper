(function () {
  'use strict';

  var fs = require('fs-extra');
  var open = require('open');

  exports.main = function (workDir, conf) {
    var baseUrl = 'http://localhost:' + conf.express_port;
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
        open(baseUrl + '/success');
      }, conf.timeout_main * 2);
    }
    else {
      setTimeout(function () {
        return open(baseUrl);
      }, conf.timeout_main);
    }
  };
})();
