(function () {
  'use strict';

  var fs = require('fs-extra');
  var path = require('path');
  var yaml = require('js-yaml');

  var enc = 'utf8';

  exports.conf = function () {
    var conf;
    var yml;

    // Try getting conf from global process object.
    if (typeof process.env.conf === 'string') {
      try {
        conf = JSON.parse(process.env.CONF);
      }
      catch (err) {
        // Fail gracefully.
      }
    }
    if (!conf) {
      yml = fs.readFileSync(__dirname + '/../../conf.yml', enc);
      conf = yaml.safeLoad(yml);
    }

    return conf;
  };

  exports.data = function (conf) {
    'use strict';

    return fs.readJsonSync(__dirname + '/../../' + conf.src + '/_data/data.json', {throws: false});
  };

  exports.rootDir = function () {
    'use strict';

    return path.normalize(__dirname + '/../..');
  };
})();
