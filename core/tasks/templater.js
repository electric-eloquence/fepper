/**
 * Compiles templates in Pattern Lab to templates in backend.
 *
 * Converts Mustache tags into whatever type of tokens are used by the backend
 * webapp based on mappings in a YAML file named similarly to the Mustache
 * template.
 */
'use strict';

var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var yaml = require('js-yaml');

var utils = require('../lib/utils');

exports.mustacheRecurse = function (file, conf, patternDir) {
  var code;
  var code1 = '';
  var codeSplit;
  var i;
  var j;
  var partial;
  var partialCode;

  try {
    // Read code which will receive token replacement.
    code = fs.readFileSync(file, conf.enc);
    // Split by Mustache tag for parsing.
    codeSplit = code.split('{{');
    for (i = 0; i < codeSplit.length; i++) {
      // Signal the OK to recurse by appending partial tags with the .mustache
      // extension. We do NOT want to recurse EVERY included partial because
      // then the outputted file will not contain any partials, which defeats
      // the purpose of recursing templates in the first place.
      if (codeSplit[i].search(/^>\s*[\w\-\.\/~]+\.mustache\s*\}\}/) > -1) {
        partial = codeSplit[i].split('}}');
        partial[0] = partial[0].replace(/^>\s*/, '').trim();
        partialCode = exports.mustacheRecurse(patternDir + '/' + partial[0], conf, patternDir);
        code1 += partialCode;
        for (j = 0; j < partial.length; j++) {
          if (j > 0) {
            code1 += partial[j];
            if (j < partial.length - 1) {
              code1 += '}}';
            }
          }
        }
      }
      else {
        if (i > 0) {
          code1 += '{{' + codeSplit[i];
        }
        else {
          code1 += codeSplit[i];
        }
      }
    }

    return code1;
  }
  catch (err) {
    utils.error(err);
  }
};

exports.mustacheUnescape = function (escaped) {
  var unescaped = escaped.replace(/\{\s*/, '{\\s');
  unescaped = unescaped.replace(/\s*\}/, '\\s}');

  return unescaped;
};

exports.templateProcess = function (file, templatesDirDefault, templatesExtDefault, workDir, conf, pref) {
  var code;
  var data = null;
  var dest;
  var mustacheFile;
  var patternDir = workDir + '/' + conf.src + '/_patterns';
  var sourceDir = patternDir + '/03-templates';
  var sourceDir1 = sourceDir;
  var stats = null;
  var stats1 = null;
  var templatesDir = '';
  var templatesExt = '';
  var yml;
  var ymlFile = '';

  // Exclude files prefixed by __
  if (path.basename(file).slice(0, 2) === '__') {
    return;
  }

  if (path.extname(file) === '.yml') {
    mustacheFile = file.replace(/\.yml$/, '.mustache');
    ymlFile = file;
  }
  else if (path.extname(file) === '.mustache') {
    mustacheFile = file;
    ymlFile = file.replace(/\.mustache$/, '.yml');
  }

  try {
    stats = fs.statSync(mustacheFile);
  }
  catch (err) {
    // Only process templates that actually exist.
    return;
  }

  try {
    stats1 = fs.statSync(ymlFile);
  }
  catch (err) {
    // Fail gracefully.
  }

  // Return on stat fail. Exclude non-files.
  if (!stats || !stats.isFile()) {
    return;
  }

  // Try to read YAML file if it exists.
  if (stats1 && stats1.isFile()) {
    // Read YAML file and store keys/values in tokens object.
    try {
      yml = fs.readFileSync(ymlFile, conf.enc);
      data = yaml.safeLoad(yml);

      if (typeof data.templates_dir === 'string') {
        templatesDir = utils.backendDirCheck(workDir, data.templates_dir);
        // Do not maintain nested directory structure in backend if
        // templates_dir is set in exceptional YAML file.
        if (templatesDir) {
          sourceDir1 = path.dirname(mustacheFile);
        }
        // Unset templates_dir in local YAML data.
        delete data.templates_dir;
      }

      if (typeof data.templates_ext === 'string') {
        templatesExt = utils.extCheck(data.templates_ext);
        // Unset templates_dir in local YAML data.
        delete data.templates_ext;
      }
    }
    catch (err) {
      // Fail gracefully.
      data = null;
    }
  }

  if (templatesDirDefault && !templatesDir) {
    templatesDir = templatesDirDefault;
  }

  if (templatesExtDefault && !templatesExt) {
    templatesExt = templatesExtDefault;
  }

  if (templatesDir && templatesExt) {
    // Recurse through Mustache templates (sparingly. See comment above.)
    code = exports.mustacheRecurse(mustacheFile, conf, patternDir);
    // Iterate through tokens and replace keys for values in the code.
    code = exports.tokensReplace(data, code, conf, pref);
    // Write compiled templates.
    dest = exports.templatesWrite(mustacheFile, sourceDir1, templatesDir, templatesExt, code);

    // Log to console.
    utils.log('Template \x1b[36m%s\x1b[0m synced.', dest.replace(workDir, '').replace(/^\//, ''));
  }
};

exports.templatesGlob = function (sourceDir) {
  var globbed = glob.sync(sourceDir + '/*.mustache');
  var globbed1 = glob.sync(sourceDir + '/!(_nosync)/**/*.mustache');

  return globbed.concat(globbed1);
};

exports.templatesWrite = function (file, sourceDir, templatesDir, templatesExt, code) {
  // Determine destination for token-replaced code.
  var dest = file.replace(sourceDir, '');

  // Replace underscore prefixes.
  dest = dest.replace(/\/_([^\/]+)$/, '/$1');
  dest = templatesDir + dest;
  dest = dest.replace(/mustache$/, templatesExt);

  // Write to file system.
  fs.mkdirpSync(path.dirname(dest));
  fs.writeFileSync(dest, code);

  return dest;
};

exports.tokensReplace = function (tokens, code, conf, pref) {
  var i;
  var regex;
  var token;
  var unescaped;

  for (i in tokens) {
    if (tokens.hasOwnProperty(i)) {
      unescaped = exports.mustacheUnescape(i);
      regex = new RegExp('\\{\\{\\{?\\s*' + unescaped + '\\s*\\}?\\}\\}', 'g');
      token = tokens[i].replace(/^\n/, '');
      token = token.replace(/\n$/, '');
      code = code.replace(regex, token);
    }
  }

  // Delete remaining Mustache tags if configured to do so.
  if (!pref.templater.retain_mustache) {
    code = code.replace(/\{\{[^\(]*?(\([\S\s]*?\))?\s*\}?\}\}\s*\n?/g, '');
  }
  // Replace escaped curly braces.
  code = code.replace(/\\\{/g, '{');
  code = code.replace(/\\\}/g, '}');

  return code;
};

exports.main = function (workDir, conf, pref) {
  var i;
  var patternDir = workDir + '/' + conf.src + '/_patterns';
  var sourceDir = patternDir + '/03-templates';
  var files = exports.templatesGlob(sourceDir);
  var templatesDirDefault = utils.backendDirCheck(workDir, pref.backend.synced_dirs.templates_dir);
  var templatesExtDefault = utils.extCheck(pref.backend.synced_dirs.templates_ext);

  // Search source directory for Mustache files.
  // Excluding templates in _nosync directory and those prefixed by __.
  // Trying to keep the globbing simple and maintainable.
  for (i = 0; i < files.length; i++) {
    exports.templateProcess(files[i], templatesDirDefault, templatesExtDefault, workDir, conf, pref);
  }
};
