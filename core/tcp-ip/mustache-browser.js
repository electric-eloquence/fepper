(function () {
  'use strict';

  var fs = require('fs');

  var htmlObj = require('../lib/html');

  module.exports = class {
    constructor(workDir, conf) {
      this.workDir = workDir;
      this.conf = conf;
    }

    /**
     * Message indicating inability to match a partial to a Mustache file.
     */
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

    /**
     * Strip Mustache tag to only the partial path.
     */
    partialTagToPath(partial) {
      partial = partial.replace(/{{+[^\w]?\s*/, '');
      partial = partial.replace(/\s*}+}/, '');
      partial = partial.replace(/\(.*\)/, '');
      if (partial.indexOf('.mustache') !== partial.length - 9) {
        partial = partial + '.mustache';
      }

      return partial;
    }

    /**
     * Recursively strip token span tags output by the Pattern Lab code viewer.
     */
    spanTokensStrip(code) {
      code = code.replace(/<span class="token [^>]*>([^<]*)<\/span>/g, '$1');
      if (code.match(/<span class="token [^>]*>([^<]*)<\/span>/)) {
        code = this.spanTokensStrip(code);
      }

      return code;
    }

    /**
     * Make angle brackets and newlines viewable as HTML and hotlink partials.
     */
    toHtmlEntitiesAndLinks(data) {
      data = data.replace(/</g, '&lt;');
      data = data.replace(/>/g, '&gt;');
      data = data.replace(/{{&gt;[^}]*}}/g, '<a href="?partial=$&">$&</a>');
      data = data.replace(/\n/g, '<br>');

      return data;
    }

    main() {
      return function (req, res) {
        var code = '';
        var output = '';
        var partial;

        if (typeof req.query.code === 'string') {
          try {
            code += req.query.code;
            // Strip Pattern Lab's token span tags.
            code = this.spanTokensStrip(code);
            // HTML entities and links.
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
