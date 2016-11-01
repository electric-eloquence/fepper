"use strict";

var partial_hunter = function () {
  function replacePartials(pattern, patternlab, level, content) {
    var dataKey;
    var dataKeysRegex;
    var escapedKeys = pattern.dataKeysEscaped;
    var i;
    var j;
    var newTemplate = content || pattern.extendedTemplate;
    var partialContent;
    var partials;
    var partialsUnique;
    var pMatch;
    var regex;
    var regexStr;
    var tag;
    var tmpPattern;

    if (!pattern.engine) {
      return;
    }

    //apply replacement based on allowable characters from lines 78 and 79 of mustache.js
    //of the Mustache for JS project.
    dataKeysRegex = new RegExp('\\{\\{([\\{#\\^\\/&]?(\\s*|[^\\}]*\\.)(' + escapedKeys + '\\s*)\\}\\}', 'g');

    newTemplate = newTemplate.replace(dataKeysRegex, '\u0002$1}}');

    //removing empty lines reduces rendering time considerably.
    //TODO: do this earlier and only once.
    newTemplate = newTemplate.replace(/^\s*$\n/gm, '');

    //escape partial includes so they are not erased by a render
    newTemplate = newTemplate.replace(/\{\{>/g, '\u0002>');

    //render this pattern immediately, so as to delete blocks not keyed to anything in dataKeysRegex
    newTemplate = pattern.engine.renderPattern(newTemplate, {});

    //unescape data keys and partial includes
    newTemplate = newTemplate.replace(/\u0002/g, '{{');
/*
    //find all remaining partial tags
    partials = pattern.engine.findPartials(newTemplate) || [];

    //create array of unique elements so the tags can be use for global replace
    partialsUnique = partials.filter(function (value, index, thisArray) {
      return thisArray.indexOf(value) === index;
    });

    //replace remaining partials with their content
    for (i = 0; i < partialsUnique.length; i++) {
      pMatch = partialsUnique[i];

      for (j in patternlab.partials) {
        if (patternlab.partials.hasOwnProperty(j)) {
          tag = j;
          partialContent = patternlab.partials[j].content;

          if (pMatch === tag) {

            //check if this tag has any style modifiers
            if (pattern.engine.findPartialsWithStyleModifiersRE.exec(tag)) {
              //if so, add the style modifiers to partialContent
              tmpPattern = {extendedTemplate: partialContent};
              style_modifier_hunter.consume_style_modifier(tmpPattern, tag, patternlab);
              partialContent = tmpPattern.extendedTemplate;
            }

            //we want to globally replace instances of this tag in case it was
            //included within a partial from within this for loop
            if (typeof pattern.engine.escapeReservedRegexChars === 'function') {
              regexStr = pattern.engine.escapeReservedRegexChars(tag);
            } else {
              regexStr = tag;
            }
            regex = new RegExp(regexStr, 'g');
            newTemplate = newTemplate.replace(regex, partialContent);
          }
        }
      }
    }

    pattern.extendedTemplate = newTemplate;
*/
    return newTemplate;
  }

  function renderParams(content, partialObj, pattern) {
    if (!pattern.engine) {
      return null;
    }

    var i;
    var escapedKey;
    var contentNew = content;
    var regex;

    if (partialObj.params) {
      contentNew = '{{=\u0002 \u0003=}}' + contentNew;

      for (i in partialObj.params) {
        if (partialObj.params.hasOwnProperty(i)) {
          escapedKey = pattern.engine.escapeReservedRegexChars(i);

          // apply replacement based on allowable characters from lines 78 and 79 of mustache.js
          // of the Mustache for JS project.
          regex = new RegExp('\\{\\{([\\{#\\^\\/&]?\\s*' + escapedKey + '\\s*)\\}?\\}\\}', 'g');

          contentNew = contentNew.replace(regex, '\u0002$1\u0003');
        }
      }

      // render this pattern immediately, so as to delete blocks not keyed to allData
      contentNew = pattern.engine.renderPattern(contentNew, partialObj.params);
    }

    return contentNew;
  }

  function renderPartial_bak(content, pattern, patternlab) {
    if (!pattern.engine) {
      return null;
    }

    var contentNew = content;
    var engine = pattern.engine;

    if (contentNew.indexOf('{{') > -1 && contentNew.indexOf('}}') > -1) {
      contentNew = contentNew.replace(pattern.dataKeysRegex, '\u0002$1}}');

      // removing empty lines reduces rendering time considerably.
      contentNew = contentNew.replace(/^\s*$\n/gm, '');

      // escape partial includes so they are not erased by a render
      contentNew = engine.escapeIncludeTags(contentNew, 'g');

      // render this pattern immediately, so as to delete blocks not keyed to allData
      contentNew = engine.renderPattern(contentNew, pattern.allData);

      // unescape data keys not not partial includes
      contentNew = contentNew.replace(/\u0002(?!>)/g, '{{');

      // render this pattern again with only relevant tags
      contentNew = pattern.engine.renderPattern(contentNew, pattern.allData);

      // unescape partial includes
      contentNew = engine.unescapeIncludeTags(contentNew, 'g');
    }

    return contentNew;
  }

  function renderPartial(content, pattern) {
    var contentNew = content;
    var engine = pattern.engine;

    if (contentNew.indexOf('{{') > -1 && contentNew.indexOf('}}') > -1) {
      // removing empty lines reduces rendering time considerably.
      contentNew = contentNew.replace(/^\s*$\n/gm, '');

      // escape partial includes so they are not erased by a render
      contentNew = engine.escapeIncludeTags(contentNew, 'g');

      // render this pattern immediately, so as to delete blocks not keyed to allData
      contentNew = engine.renderPattern(contentNew, pattern.allData);

      // unescape partial includes
      contentNew = engine.unescapeIncludeTags(contentNew, 'g');
    }

    return contentNew;
  }

  return {
    replace_partials: function (pattern, patternlab, level, content) {
      return replacePartials(pattern, patternlab, level, content);
    },
    render_params: function (content, partialObj, pattern) {
      return renderParams(content, partialObj, pattern);
    },
    render_partial: function (content, pattern, patternlab) {
      return renderPartial(content, pattern, patternlab);
    }
  };
};

module.exports = partial_hunter;
