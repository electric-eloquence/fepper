var fs = require('fs-extra');
var path = require('path');
var yaml = require('js-yaml');

var enc = 'utf8';
var rootDir = path.normalize(__dirname + '/../..');

module.exports.conf = function () {
  var conf;
  var yml;

  // Try getting conf from global process object.
  if (typeof process.env.conf === 'string') {
    try {
      conf = JSON.parse(process.env.CONF);
    }
    catch (er) {
    }
  }
  if (!conf) {
    yml = fs.readFileSync(rootDir + '/conf.yml', enc);
    conf = yaml.safeLoad(yml);
  }

  return conf;
};

module.exports.data = function (conf) {
  return fs.readJsonSync(rootDir + '/' + conf.src + '/_data/data.json', {throws: false});
};

module.exports.rootDir = rootDir;
