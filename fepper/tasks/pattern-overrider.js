/**
 * Writes browser JavaScript files for overriding Pattern Lab.
 *
 * The Mustache files in _patternlab_files do not respect variables defined in
 * data.json or conf.yml. In order to run browser JavaScripts configured with
 * these variables, write out the configured code to pattern-overrider.js.
 */
(function () {
  'use strict';

  var fs = require('fs-extra');
  var path = require('path');
  var yaml = require('js-yaml');

  var conf = global.conf;
  var utils = require('../lib/utils');
  var rootDir = utils.rootDir();

  exports.main = function () {
    var dataJson = utils.data(conf);
    var defaultPort = 35729;
    var dest = rootDir + '/' + conf.pub + '/js/pattern-overrider.js';
    var output;

    // Initialize destination file.
    fs.mkdirsSync(path.dirname(dest));
    fs.writeFileSync(dest, '');

    if (typeof dataJson.homepage === 'string') {
      output = 'if (window.location.pathname.indexOf(\'/styleguide/html/styleguide.html\') > -1 && window.location.search === \'\') {\n';
      output += '  window.location = \'../../patterns/' + dataJson.homepage  + '/' + dataJson.homepage + '.html\';\n';
      output += '}\n';
    }

    // Write out the homepage redirector.
    fs.appendFileSync(dest, output);

    // Check if LiveReload port set in conf.yml. If not, use default.
    if (typeof conf.livereload_port !== 'number'  &&  typeof conf.livereload_port !== 'string') {
      conf.livereload_port = defaultPort;
    }
    output = 'if (window.location.port === \'' + conf.express_port + '\') {\n';
    output += '  //<![CDATA[\n';
    output += '    document.write(\'<script type="text/javascript" src="http://HOST:' + conf.livereload_port + '/livereload.js"><\\/script>\'.replace(\'HOST\', location.hostname));\n';
    output += '  //]]>\n';
    output += '}\n';

    // Write out the LiveReloader.
    fs.appendFileSync(dest, output);
  };
})();
