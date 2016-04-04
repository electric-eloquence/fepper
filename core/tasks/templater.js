/**
 * Compiles templates in Pattern Lab to templates in backend.
 *
 * Converts Mustache tags into whatever type of tokens are used by the backend
 * webapp based on mappings in a YAML file named similarly to the Mustache
 * template.
 */
(function () {
  'use strict';

  var fs = require('fs-extra');
  var glob = require('glob');
  var path = require('path');
  var yaml = require('js-yaml');

  var utils = require('../lib/utils');

  exports.mustacheRecurse = function (file, conf, patternDir) {
    var code1;
    var code2 = '';
    var codeSplit;
    var i;
    var j;
    var partial;
    var partialCode;

    try {
      // Read code which will receive token replacement.
      code1 = fs.readFileSync(file, conf.enc);
      // Split by Mustache tag for parsing.
      codeSplit = code1.split('{{');
      for (i = 0; i < codeSplit.length; i++) {
        // Replace line feeds and carriage returns with tokens.
        codeSplit[i] = codeSplit[i].replace(/\n/g, '{{ \\n }}');
        codeSplit[i] = codeSplit[i].replace(/\r/g, '{{ \\r }}');
        // Signal the OK to recurse by appending partial tags with the .mustache
        // extension. We do NOT want to recurse EVERY included partial because
        // then the outputted file will not contain any partials, which defeats
        // the purpose of recursing templates in the first place.
        if (codeSplit[i].match(/^>\s*[\w\-\.\/]+\.mustache\s*}}/)) {
          partial = codeSplit[i].split('}}');
          partial[0] = partial[0].replace(/^>\s*/, '').trim();
          partialCode = exports.mustacheRecurse(patternDir + '/' + partial[0], conf, patternDir);
          code2 += partialCode;
          for (j = 0; j < partial.length; j++) {
            if (j > 0 && j < partial.length - 1) {
              code2 += partial[j] + '}}';
            }
          }
        }
        else {
          if (i > 0) {
            code2 += '{{' + codeSplit[i];
          }
          else {
            code2 += codeSplit[i];
          }
        }
      }
      // Reinstate line feeds and carriage returns.
      code2 = code2.replace(/{{ \\n }}/g, '\n');
      code2 = code2.replace(/{{ \\r }}/g, '\r');

      return code2;
    }
    catch (err) {
      utils.error(err);
    }
  };

  exports.mustacheUnescape = function (escaped) {
    var unescaped = escaped.replace(/{\s*/, '{\\s');
    unescaped = unescaped.replace(/\s*}/, '\\s}');
    return unescaped;
  };

  exports.templatesGlob = function (srcDir) {
    var glob1 = glob.sync(srcDir + '/!(__)*.mustache');
    var glob2 = glob.sync(srcDir + '/!(_no_sync)/!(__)*.mustache');
    return glob1.concat(glob2);
  };

  exports.templatesWrite = function (file, srcDir, templatesDir, templatesExt, code) {
    // Determine destination for token-replaced code.
    var dest = file.replace(srcDir, '');
    // Replace underscore prefixes.
    dest = dest.replace(/\/_([^\/]+)$/, '/$1');
    dest = templatesDir + dest;
    dest = dest.replace(/mustache$/, templatesExt);

    // Write to file system.
    fs.mkdirsSync(path.dirname(dest));
    fs.writeFileSync(dest, code);

    return dest;
  };

  exports.tokensLoad = function (ymlFile, conf) {
    var tokens;
    var yml = '';

    try {
      yml = fs.readFileSync(ymlFile, conf.enc);
      tokens = yaml.safeLoad(yml);
    }
    catch (err) {
      // Fail gracefully.
      tokens = {};
    }

    return tokens;
  };

  exports.tokensReplace = function (tokens, code, conf) {
    var i;
    var re;
    var token;
    var unescaped;

    for (i in tokens) {
      if (tokens.hasOwnProperty(i)) {
        unescaped = exports.mustacheUnescape(i);
        re = new RegExp('{{\\s*' + unescaped + '\\s*}}', 'g');
        token = tokens[i].replace(/\n$/, '');
        code = code.replace(re, token);
      }
    }

    // Delete remaining Mustache tags if configured to do so.
    if (!conf.templater.retain_mustache) {
      code = code.replace(/{{(.|\s)*?}?}}\s*\n?/g, '');
    }
    // Replace escaped curly braces.
    code = code.replace(/\\{/g, '{');
    code = code.replace(/\\}/g, '}');

    return code;
  };

  exports.main = function (workDir, conf, destDir, ext) {
    var code;
    var dest;
    var files;
    var i;
    var patternDir = workDir + '/' + conf.src + '/_patterns';
    var srcDir = patternDir + '/03-templates';
    var stats;
    var templatesDir;
    var templatesExt;
    var tokens;
    var ymlFile = '';

    try {
      templatesDir = destDir ? destDir : conf.backend.synced_dirs.templates_dir;
      // Only proceed if templatesDir is a string.
      if (typeof templatesDir !== 'string') {
        return;
      }
      // Only proceed if templatesDir is an existing directory.
      templatesDir = utils.rootDir() + '/backend/' + templatesDir;
      stats = fs.statSync(templatesDir);
      if (!stats.isDirectory()) {
        return;
      }

      templatesExt = ext ? ext : conf.backend.synced_dirs.templates_ext;
      // Only proceed if templates_ext is a string.
      if (typeof templatesExt !== 'string') {
        return;
      }
      // Only proceed if templatesExt is set correctly.
      if (!templatesExt.match(/^[\w\-\.\/]+$/)) {
        return;
      }

      // Search source directory for Mustache files.
      // Excluding templates in _nosync directory and those prefixed by __.
      // Trying to keep the globbing simple and maintainable.
      files = exports.templatesGlob(srcDir);
      for (i = 0; i < files.length; i++) {
        // Read YAML file and store keys/values in tokens object.
        ymlFile = files[i].replace(/\.mustache$/, '.yml');
        // Make sure the YAML file exists before proceeding.
        try {
          stats = fs.statSync(ymlFile);
        }
        catch (err) {
          // Unset ymlFile if no YAML file.
          ymlFile = '';
        }

        // Recurse through Mustache templates (sparingly. See comment above)
        code = exports.mustacheRecurse(files[i], conf, patternDir);
        // Load tokens from YAML file.
        tokens = exports.tokensLoad(ymlFile, conf);
        // Iterate through tokens and replace keys for values in the code.
        code = exports.tokensReplace(tokens, code, conf);
        // Write compiled templates.
        dest = exports.templatesWrite(files[i], srcDir, templatesDir, templatesExt, code);

        // Log to console.
        utils.log('Template \x1b[36m%s\x1b[0m synced.', dest.replace(workDir, '').replace(/^\//, ''));
      }
    }
    catch (err) {
      utils.error(err);
    }
  };
})();
