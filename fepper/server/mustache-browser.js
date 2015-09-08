var fs = require('fs');

var utils = require('../lib/utils');
var conf = utils.conf();
var rootDir = utils.rootDir;

var htmlObj = require('../lib/html');
var patternDir = rootDir + '/' + conf.src + '/_patterns/';

function linkMustache(unlinked) {
  'use strict';

  var linked = unlinked.replace(/</g, '&lt;');
  linked = linked.replace(/>/g, '&gt;');
  linked = linked.replace(/{{&gt;[^{]*}}/g, '<a href="?partial=$&">$&</a>');
  linked = linked.replace(/\n/g, '<br>');
  return linked;
}


function stripMustache(unstripped) {
  'use strict';

  var stripped = unstripped.replace(/{{+[^\w]?\s*/, '');
  stripped = stripped.replace(/\s*}+}/, '');
  return stripped;
}


function noResult(res, er) {
  'use strict';

  var output = '';
  output += htmlObj.headNoStyles;
  if (typeof er === 'string') {
    output += er;
  }
  else {
    output += 'There is no Mustache template there by that name. Perhaps you need to use <a href="http://patternlab.io/docs/pattern-including.html" target="_blank">the more verbosely pathed syntax.</a>';
  }
  output += htmlObj.foot;
  output = output.replace('{{ title }}', 'Fepper Mustache Browser' );
  res.end(output);
}


module.exports = function (req, res) {
  'use strict';

  var code = '';
  var output = '';
  var partial;

  if (typeof req.query.code === 'string') {
    try {
      code += req.query.code;
      code = linkMustache(code);
      if (typeof req.query.title === 'string') {
        code = '<h1>' + req.query.title + '</h1>\n' + code;
      }
      // Render the output with HTML head and foot.
      output += htmlObj.headNoStyles;
      output += code;
      output += htmlObj.foot;
      output = output.replace('{{ title }}', 'Fepper Mustache Browser' );
      res.end(output);
    }
    catch (er) {
      noResult(res, er);
    }
  }
  else if (typeof req.query.partial === 'string') {
    try {
      // Requires verbosely pathed Mustache partial syntax.
      partial = stripMustache(req.query.partial);
      partial = partial.replace(/\(.*\)/, '');
      partial = partial.replace(/\.mustache$/, ''); // In case the .mustache ext was included.
      partial = partial + '.mustache';

      // Check if query string correlates to actual Mustache file.
      var stats = fs.statSync(patternDir + partial);
      if (stats.isFile()) {
        fs.readFile(patternDir + partial, conf.enc, function(er, dat) {
          // Render the Mustache code if it does.
          // First, link the Mustache tags.
          dat = linkMustache(dat);
          // Render the output with HTML head and foot.
          output += htmlObj.headNoStyles;
          output += '<h1>' + partial + '</h1>';
          output += dat;
          output += htmlObj.foot;
          output = output.replace('{{ title }}', 'Fepper Mustache Browser' );
          res.end(output);
        });
      }
      else {
        noResult(res);
      }
    }
    catch (er) {
      noResult(res);
    }
  }
};
