/**
 * Writes browser JavaScript files for overriding Pattern Lab.
 *
 * The Mustache files in Pattern Lab do not respect variables defined in
 * conf.yml or pref.yml. In order to run browser JavaScripts configured with
 * these variables, write out the configured code to pattern-overrider.js.
 */
'use strict';

const conf = global.conf;

const fs = require('fs-extra');
const path = require('path');

const utils = require('../lib/utils');

exports.main = function () {
  var dest = utils.pathResolve(conf.ui.paths.public.js + '/pattern-overrider.js');

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
      // HTML entities for mustacheBrowser.spanTokensStrip() to work.
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
  fs.mkdirpSync(path.dirname(dest));
  fs.writeFileSync(dest, output);

  // Write out the homepage redirector.
  fs.appendFileSync(dest, output);

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
