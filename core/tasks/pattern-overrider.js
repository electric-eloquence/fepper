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

  var utils = require('../lib/utils');

  exports.main = function (workDir, conf) {
    var dataJson = utils.data(workDir, conf);
    var defaultPort = 35729;
    var dest = workDir + '/' + conf.pub + '/scripts/pattern-overrider.js';

    // Backticked multi-line string.
    var output = `// Mustache code browser.
var pd = parent.document;
var codeFill = pd.getElementById('sg-code-fill');
var codeTitle = pd.getElementById('sg-code-title-mustache');
if (codeFill) {
  // Give the PL Mustache code viewer the appearance of being linked.
  codeFill.addEventListener('mouseover', function () {
    if (codeTitle.className.indexOf('sg-code-title-active') > -1) {
      this.style.cursor = 'pointer';
    }
    else {
      this.style.cursor = 'default';
    }
  });
  // Send to Fepper's Mustache browser when clicking the viewer's Mustache code.
  codeFill.addEventListener('click', function () {
    if (codeTitle.className.indexOf('sg-code-title-active') > -1) {
      var code = encodeURIComponent(this.innerHTML);
      // HTML entities where necessary.
      code = code.replace(/><</g, '>&lt;<');
      code = code.replace(/><\\/</g, '>&lt;/<');
      code = code.replace(/><!--/g, '>&lt;!--');
      var title = pd.getElementById('title').innerHTML.replace('Pattern Lab - ', '');
      window.location = window.location.origin + '/mustache-browser/?title=' + title + '&code=' + code;
    }
  });
}

`;

    // Initialize destination file.
    fs.mkdirsSync(path.dirname(dest));
    fs.writeFileSync(dest, output);

    if (typeof dataJson.homepage === 'string') {
      // Backticked multi-line string.
      output = `// Redirect away from all-patterns page on launch.
if (window.location.pathname.indexOf('/styleguide/html/styleguide.html') > -1 && window.location.search === '') {
  window.location = '../../patterns/${dataJson.homepage}/${dataJson.homepage}.html';
}

`;
    }

    // Write out the homepage redirector.
    fs.appendFileSync(dest, output);

    // Check if LiveReload port set in conf.yml. If not, use default.
    if (typeof conf.livereload_port !== 'number' && typeof conf.livereload_port !== 'string') {
      conf.livereload_port = defaultPort;
    }
    // Backticked multi-line string.
    output = `// LiveReload.
if (window.location.port === '${conf.express_port}') {
  //<![CDATA[
    document.write('<script type="text/javascript" src="http://HOST:${conf.livereload_port}/livereload.js"><\\/script>'.replace('HOST', location.hostname));
  //]]>
}
`;

    // Write out the LiveReloader.
    fs.appendFileSync(dest, output);
  };
})();
