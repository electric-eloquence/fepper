(function () {
  'use strict';

  var fs = require('fs');

  var htmlObj = require('../lib/html');

  module.exports = class {
    constructor(workDir, conf) {
      this.workDir = workDir;
      this.conf = conf;
    }

    toHtmlEntitiesAndLinks(data) {
      data = data.replace(/</g, '&lt;');
      data = data.replace(/>/g, '&gt;');
      data = data.replace(/{{&gt;[^}]*}}/g, '<a href="?partial=$&">$&</a>');
      data = data.replace(/\n/g, '<br>');

      return data;
    }

    partialTagToPath(partial) {
      partial = partial.replace(/{{+[^\w]?\s*/, '');
      partial = partial.replace(/\s*}+}/, '');
      partial = partial.replace(/\(.*\)/, '');
      if (partial.indexOf('.mustache') !== partial.length - 9) {
        partial = partial + '.mustache';
      }

      return partial;
    }

    noResult(res, err) {
      var output = '';
      output += htmlObj.headNoStyles;
      if (typeof err === 'string') {
        output += err;
      }
      else {
        output += 'There is no Mustache template there by that name. Perhaps you need to use <a href="http://patternlab.io/docs/pattern-including.html" target="_blank">the more verbosely pathed syntax.</a>';
      }
      output += htmlObj.foot;
      output = output.replace('{{ title }}', 'Fepper Mustache Browser');
      res.end(output);
    }

    main() {
      return function (req, res) {
        var code = '';
        var i;
        var output = '';
        var partial;

        if (typeof req.query.code === 'string') {
          try {
            code += req.query.code;
            // Strip Pattern Lab's token span tags. Iterate 3 times since they
            // are nested a maximum depth of 3.
            for (i = 0; i < 3; i++) {
              code = code.replace(/<span class="token [^>]*>([^<]*)<\/span>/g, '$1');
            }
            code = this.toHtmlEntitiesAndLinks(code);
            if (typeof req.query.title === 'string') {
              code = '<h1>' + req.query.title + '</h1>\n' + code;
            }
            // Render the output with HTML head and foot.
            output += htmlObj.headNoStyles;
            output += code;
            output += htmlObj.foot;
            output = output.replace('{{ title }}', 'Fepper Mustache Browser');
            res.end(output);
          }
          catch (err) {
            this.noResult(res, err);
          }
        }
        else if (typeof req.query.partial === 'string') {
          try {
            // Requires verbosely pathed Mustache partial syntax.
            partial = this.partialTagToPath(req.query.partial);

            // Check if query string correlates to actual Mustache file.
            var stats = fs.statSync(this.workDir + '/' + partial);
            if (stats.isFile()) {
              fs.readFile(this.workDir + '/' + partial, this.conf.enc, function (err, data) {
                // Render the Mustache code if it does.
                // First, link the Mustache tags.
                data = this.toHtmlEntitiesAndLinks(data);
                // Render the output with HTML head and foot.
                output += htmlObj.headNoStyles;
                output += '<h1>' + partial + '</h1>';
                output += data;
                output += htmlObj.foot;
                output = output.replace('{{ title }}', 'Fepper Mustache Browser');
                res.end(output);
              }.bind(this));
            }
            else {
              this.noResult(res);
            }
          }
          catch (err) {
            this.noResult(res);
          }
        }
      }.bind(this);
    }
  };
})();
