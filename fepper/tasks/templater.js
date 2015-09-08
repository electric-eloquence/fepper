(function () {
  'use strict';

  var fs = require('fs-extra');
  var glob = require('glob');
  var yaml = require('js-yaml');

  var utils = require('../lib/utils');
  var conf = utils.conf();
  var rootDir = utils.rootDir;

  var code;
  var dest;
  var destDir;
  var files;
  var i;
  var j;
  var patternDir = rootDir + '/' + conf.src + '/_patterns/';
  var re;
  var srcDir = patternDir + '03-templates';
  var stats;
  var templatesDir;
  var templatesExt;
  var token;
  var tokens;
  var unescaped;
  var yml;
  var ymlFile;


  function recurseMustache(file) {
    var code1;
    var code2 = '';
    var codeSplit;
    var k;
    var partial;
    var partialCode;

    try {
      // Read code which will receive token replacement.
      code1 = fs.readFileSync(file, conf.enc);
      // Split code line by line for parsing.
      codeSplit = code1.split('\n');
      for (k = 0; k < codeSplit.length; k++) {
        // Signal the OK to recurse by appending partial tags with the .mustache
        // extension. We do NOT want to recurse EVERY included partial because
        // then the outputted file will not contain any partials, which defeats
        // the purpose of recursing templates in the first place.
        if (codeSplit[k].match(/\/[^\/]*\.mustache\s*}}/)) {
          partial = stripMustache(codeSplit[k]).trim();
          partialCode = recurseMustache(patternDir + partial);
          code2 += partialCode;
        }
        else {
          code2 += codeSplit[k] + '\n';
        }
      }

      return code2;
    }
    catch (er) {
      console.error(er);
    }
  }


  function stripMustache(unstripped) {
    var stripped = unstripped.replace(/{{+[^\w]?\s*/, '');
    stripped = stripped.replace(/\s*}+}/, '');
    return stripped;
  }


  function unescapeMustache(escaped) {
    var unescaped = escaped.replace(/{\s*/, '{\\s');
    unescaped = unescaped.replace(/\s*}/, '\\s}');
    return unescaped;
  }


  try {
    // Only proceed if templates_dir is set.
    if (typeof conf.backend.synced_dirs.templates_dir === 'string') {
      templatesDir = conf.backend.synced_dirs.templates_dir;

      // Only proceed if templates_ext is set.
      if (typeof conf.backend.synced_dirs.templates_ext === 'string') {
        templatesExt = conf.backend.synced_dirs.templates_ext;

        // Only proceed if templatesExt is set correctly.
        if (templatesExt.match(/^[\w.\/-]+$/)) {

          // Only proceed if templatesDir exists.
          templatesDir = rootDir + '/backend/' + templatesDir;
          stats = fs.statSync(templatesDir);
          if (stats.isDirectory()) {

            // Search source directory for Mustache files.
            // Excluding templates in _nosync directory and those prefixed by __.
            // Trying to keep the globbing simple and maintainable.
            files = glob.sync(srcDir + '/!(_no_sync)/!(__)*.mustache');
            for (i = 0; i < files.length; i++) {
              // Read YAML file and store keys/values in tokens object.
              ymlFile = files[i].replace(/\.mustache$/, '.yml');
              // Make sure the YAML file exists before proceeding.
              try {
                stats = fs.statSync(ymlFile);
              }
              catch (er) {
                console.error(er);
                continue;
              }
              if (!stats.isFile()) {
                continue;
              }

              // Recurse through Mustache templates (sparingly. See comment above)
              code = recurseMustache(files[i]);

              yml = fs.readFileSync(ymlFile, conf.enc);
              tokens = yaml.safeLoad(yml);

              // Iterate through tokens and replace keys for values in the code.
              for (j in tokens) {
                if (tokens.hasOwnProperty(j)) {
                  unescaped = unescapeMustache(j);
                  re = new RegExp('{{\\s*' + unescaped + '\\s*}}', 'g');
                  token = tokens[j].replace(/\n$/, '');
                  code = code.replace(re, token);
                }
              }

              // Delete remaining Mustache tags.
              code = code.replace(/{{[^}]*}+}\s*\n?/g, '');
              // Replace escaped curly braces.
              code = code.replace(/\\{/g, '{');
              code = code.replace(/\\}/g, '}');
              // Determine destination for token-replaced code.
              dest = files[i].replace(srcDir, '');
              // Replace underscore prefixes.
              dest = dest.replace(/\/_([^\/]+)$/, '/$1');
              dest = templatesDir + dest;
              dest = dest.replace(/mustache$/, templatesExt);
              destDir = dest.replace(/\/[^\/]*$/, '');

              // Write to file system.
              fs.mkdirsSync(destDir);
              fs.writeFileSync(dest, code);

              // Log to console.
              console.log('Template \x1b[36m%s\x1b[0m synced.', dest.replace(rootDir, '').replace(/^\//, ''));
            }
          }
        }
      }
    }
  }
  catch (er) {
    console.error(er);
  }

})();
