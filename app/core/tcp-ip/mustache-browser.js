'use strict';

const conf = global.conf;

const fs = require('fs');

const htmlObj = require('../lib/html');
const utils = require('../lib/utils');

module.exports = class {

  /**
   * Message indicating inability to match a partial to a Mustache file.
   *
   * @param {object} res - response object.
   * @param {string} err - error.
   */
  noResult(res, err) {
    var output = '';
    output += htmlObj.head;
    if (typeof err === 'string') {
      output += err;
    }
    else {
      output += 'There is no Mustache template there by that name. Perhaps you need to use <a href="http://patternlab.io/docs/pattern-including.html" target="_blank">the more verbosely pathed syntax.</a>';
    }
    output += htmlObj.foot;
    output = output.replace('{{ title }}', 'Fepper Mustache Browser');
    output = output.replace('{{ title }}', 'Fepper Mustache Browser');
    output = output.replace('{{ title }}', 'Fepper Mustache Browser');
    res.end(output);
  }

  /**
   * Strip Mustache tag to only the partial path.
   *
   * @param {string} partial - Mustache syntax.
   * @return {string} Partial path.
   */
  partialTagToPath(partial) {
    // Strip opening Mustache braces and control character.
    partial = partial.replace(/^\{\{>\s*/, '');
    // Strip parentheses-wrapped parameter submission.
    partial = partial.replace(/\([\S\s]*?\)/, '');
    // Strip colon/pipe-delimited style modifier.
    partial = partial.replace(/\:[\w\-\|]+/, '');
    // Strip closing Mustache braces.
    partial = partial.replace(/\s*\}\}$/, '');
    if (partial.indexOf('.mustache') !== partial.length - 9) {
      partial = partial + '.mustache';
    }

    return partial;
  }

  /**
   * Recursively strip token span tags output by the Pattern Lab code viewer.
   *
   * @param {string} code - HTML/Mustache.
   * @return {string} Stripped code.
   */
  spanTokensStrip(code) {
    code = code.replace(/<span class="token [\S\s]*?>([\S\s]*?)<\/span>/g, '$1');
    if (/<span class="token [\S\s]*?>([\S\s]*?)<\/span>/.test(code)) {
      code = this.spanTokensStrip(code);
    }

    return code;
  }

  /**
   * Make angle brackets and newlines viewable as HTML and hotlink partials.
   *
   * @param {string} data - HTML/Mustache.
   * @return {string} Viewable and linkable code.
   */
  toHtmlEntitiesAndLinks(data) {
    data = data.replace(/"/g, '&quot;');
    data = data.replace(/</g, '&lt;');
    data = data.replace(/>/g, '&gt;');
    data = data.replace(/\{\{&gt;[\S\s]*?\}\}/g, '<a href="?partial=$&">$&</a>');
    data = data.replace(/\n/g, '<br>');

    return data;
  }

  main() {
    return function (req, res) {
      if (typeof req.query.code === 'string') {
        try {
          let code = req.query.code;
          // Strip Pattern Lab's token span tags.
          code = this.spanTokensStrip(code);
          // HTML entities and links.
          code = this.toHtmlEntitiesAndLinks(code);
          if (typeof req.query.title === 'string') {
            code = '<h1>' + req.query.title + '</h1>\n' + code;
          }
          // Render the output with HTML head and foot.
          let output = htmlObj.head;
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
          let partial = this.partialTagToPath(req.query.partial.trim());
          let fullPath = utils.pathResolve(`${conf.ui.paths.source.patterns}/${partial}`);

          // Check if query string correlates to actual Mustache file.
          let stats = fs.statSync(fullPath);
          if (stats.isFile()) {
            fs.readFile(fullPath, conf.enc, function (err, data) {
              // Render the Mustache code if it does.
              // First, link the Mustache tags.
              data = this.toHtmlEntitiesAndLinks(data);
              // Render the output with HTML head and foot.
              let output = htmlObj.head;
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
