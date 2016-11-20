'use strict';

var path = require('path');
var fs = require('fs-extra');
var Pattern = require('./object_factory').Pattern;
var pph = require('./pseudopattern_hunter');
var mp = require('./markdown_parser');
var plutils = require('./utilities');
var patternEngines = require('./pattern_engines');
var lh = require('./lineage_hunter');
var lih = require('./list_item_hunter');
var JSON5 = require('json5');
var _ = require('lodash');

var pattern_assembler = function () {
  // HELPER FUNCTIONS

  function getPartial(partialName, patternlab) {
    // look for exact partial matches
    for (var i = 0; i < patternlab.patterns.length; i++) {
      var pattern = patternlab.patterns[i];

      if (pattern.patternPartial === partialName) {
        return pattern;

      // also check for Pattern Lab PHP syntax for hidden patterns
      // Pattern Lab PHP strips leading underscores from pattern filenames,
      // strips leading digits plus hyphen,
      // and retains the first tilde instead of replacing it with a hyphen
      } else if (
        partialName === pattern.patternGroup + '-' + pattern.fileName.replace(/^_/, '').replace(/^\d*\-/, '')
      ) {
        return pattern;
      }
    }

    // else look by verbose syntax
    for (var i = 0; i < patternlab.patterns.length; i++) {
      switch (partialName) {
        case patternlab.patterns[i].relPath:
        case patternlab.patterns[i].relPathTrunc:
          return patternlab.patterns[i];
      }
    }

    // return the fuzzy match if all else fails
    for (var i = 0; i < patternlab.patterns.length; i++) {
      var partialParts = partialName.split('-');
      var partialType = partialParts[0];
      var partialNameEnd = partialParts.slice(1).join('-');

      if (
        patternlab.patterns[i].patternPartial.split('-')[0] === partialType &&
        patternlab.patterns[i].patternPartial.indexOf(partialNameEnd) > -1
      ) {
        return patternlab.patterns[i];
      }
    }
    console.error('Could not find pattern with partial ' + partialName);
    return undefined;
  }

  function buildListItems(container) {
    // combine all list items into one structure
    var list = [];
    for (var item in container.listitems) {
      if (container.listitems.hasOwnProperty(item)) {
        list.push(container.listitems[item]);
      }
    }
    container.listItemArray = plutils.shuffle(list);

    for (var i = 1; i <= container.listItemArray.length; i++) {
      var tempItems = [];
      if (i === 1) {
        tempItems.push(container.listItemArray[0]);
        container.listitems['' + i] = tempItems;
      } else {
        for (var c = 1; c <= i; c++) {
          tempItems.push(container.listItemArray[c - 1]);
          container.listitems['' + i] = tempItems;
        }
      }
    }

    // unset listItemArray to free memory
    container.listItemArray = null;
  }

  /*
   * Deprecated in favor of .md 'status' frontmatter inside a pattern. Still used for unit tests at this time.
   * Will be removed in future versions
   */
  function setState(pattern, patternlab, displayDeprecatedWarning) {
    if (patternlab.config.patternStates && patternlab.config.patternStates[pattern.patternPartial]) {

      if (displayDeprecatedWarning) {
        var warnUtils = 'Deprecation Warning: Using patternlab-config.json patternStates object will be deprecated in ';
        warnUtils += 'favor of the state frontmatter key associated with individual pattern markdown files.';
        plutils.logRed(warnUtils);
        var warnConsole = 'This feature will still work in it\'s current form this release (but still be overridden ';
        warnConsole += 'by the new parsing method), and will be removed in the future.';
        console.log(warnConsole);
      }

      pattern.patternState = patternlab.config.patternStates[pattern.patternPartial];
    }
  }

  function addPattern(pattern, patternlab) {
    // add the link to the global object
    patternlab.data.link[pattern.patternPartial] = '/patterns/' + pattern.patternLink;

    // only push to array if the array doesn't contain this pattern
    var isNew = true;
    for (var i = 0; i < patternlab.patterns.length; i++) {
      // so we need the identifier to be unique, which patterns[i].relPath is
      if (pattern.relPath === patternlab.patterns[i].relPath) {
        // if relPath already exists, overwrite that element
        patternlab.patterns[i] = pattern;
        isNew = false;
        break;
      }
    }

    // if the pattern is new, we must register it with various data structures!
    if (isNew) {
      if (patternlab.config.debug) {
        console.log('found new pattern ' + pattern.patternPartial);
      }
      patternlab.patterns.push(pattern);
    }
  }

  function addSubtypePattern(subtypePattern, patternlab) {
    patternlab.subtypePatterns[subtypePattern.patternPartial] = subtypePattern;
  }

  // Render a pattern on request. Long-term, this should probably go away.
  function renderPattern(pattern, data, partials) {
    // if we've been passed a full Pattern, it knows what kind of template it
    // is, and how to render itself, so we just call its render method
    if (pattern instanceof Pattern) {
      return pattern.render(data, partials);
    } else {
      // otherwise, check for the first loaded templating engine, and we
      // therefore just need to create a dummy pattern to be able to render
      // it
      var dummyPattern = Pattern.createEmpty({extendedTemplate: pattern});
      var engine;
      var engineName = Object.keys(patternEngines)[0];
      if (engineName) {
        engine = patternEngines[engineName];
      }
      if (engine) {
        return engine.renderPattern(dummyPattern, data, partials);
      } else {
        return pattern;
      }
    }
  }

  function parsePatternMarkdown(pattern, patternlab) {
    var markdown_parser = new mp();

    try {
      var markdownFileName = path.resolve(
        patternlab.config.paths.source.patterns, pattern.subdir, pattern.fileName + '.md');
      var markdownFileContents = fs.readFileSync(markdownFileName, 'utf8');

      var markdownObject = markdown_parser.parse(markdownFileContents);
      if (!plutils.isObjectEmpty(markdownObject)) {
        // set keys and markdown itself
        pattern.patternDescExists = true;
        pattern.patternDesc = markdownObject.markdown;

        // consider looping through all keys eventually. would need to blacklist some properties and whitelist others
        if (markdownObject.state) {
          pattern.patternState = markdownObject.state;
        }
        if (markdownObject.order) {
          pattern.order = markdownObject.order;
        }
        if (markdownObject.hidden) {
          pattern.hidden = markdownObject.hidden;
        }
        if (markdownObject.excludeFromStyleguide) {
          pattern.excludeFromStyleguide = markdownObject.excludeFromStyleguide;
        }
        if (markdownObject.tags) {
          pattern.tags = markdownObject.tags;
        }
        if (markdownObject.links) {
          pattern.links = markdownObject.links;
        }
      } else {
        if (patternlab.config.debug) {
          console.log('error processing markdown for ' + pattern.patternPartial);
        }
      }

      if (patternlab.config.debug) {
        console.log('found pattern-specific markdown for ' + pattern.patternPartial);
      }
    } catch (err) {
      // do nothing when file not found
      if (err.code !== 'ENOENT') {
        console.log(
          'there was an error setting pattern keys after markdown parsing of the companion file for pattern ' +
          pattern.patternPartial
        );
        console.log(err);
      }
    }
  }

  /**
   * Recursively get all the property keys from the JSON data for a pattern.
   *
   * @param {object} data
   * @param {array} uniqueKeysParam The array of unique keys to be added to and returned.
   * @returns {array} keys A flat, one-dimensional array.
   */
  function getDataKeys(data, uniqueKeysParam) {
    var uniqueKeys = uniqueKeysParam || [];

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (data.constructor !== Array) {
          if (uniqueKeys.indexOf(key) === -1) {
            uniqueKeys.push(key);
          } else {
            continue;
          }
        }
        if (typeof data[key] === 'object') {
          getDataKeys(data[key], uniqueKeys);
        }
      }
    }

    return uniqueKeys;
  }

  function getPartialInterface(pattern) {
    // construct partialObj as a precursor to the interface
    var partialObj = {
      key: '',
      partial: '',
      params: null,
      content: pattern.template.replace(/(>|\})\s+(<|\{)/g, '$1 $2').replace(/\s*\n/g, ''),
      contentRendered: '',
      nestedDataKeys: [],
      nestedPartials: []
    };

    // escape the parametered tags within partials by changing delimiters to unicodes
    // for start-of-text and end-of-text
    partialObj.nestedDataKeys = pattern.template.match(/\{\{#[\S\s]+?\}\}/g) || [];
    partialObj.nestedDataKeys = partialObj.nestedDataKeys.concat(pattern.template.match(/\{\{\^[\S\s]+?\}\}/g) || []);

    // return a stringified JSON so it can parsed into an object (and thereby cloned, not referenced) when needed
    return JSON.stringify(partialObj);
  }

  function processPatternIterative(relPath, patternlab) {
    var markdown_parser = new mp();

    // check if the found file is a top-level markdown file
    var fileObject = path.parse(relPath);
    if (fileObject.ext === '.md') {
      try {
        var proposedDirectory = path.resolve(patternlab.config.paths.source.patterns, fileObject.dir, fileObject.name);
        var proposedDirectoryStats = fs.statSync(proposedDirectory);
        if (proposedDirectoryStats.isDirectory()) {
          var subtypeMarkdownFileContents = fs.readFileSync(proposedDirectory + '.md', 'utf8');
          var subtypeMarkdown = markdown_parser.parse(subtypeMarkdownFileContents);
          var subtypePattern = new Pattern(relPath);
          subtypePattern.patternSectionSubtype = true;
          subtypePattern.patternLink = subtypePattern.name + '/index.html';
          subtypePattern.patternDesc = subtypeMarkdown.markdown;
          subtypePattern.patternPartial = 'viewall-' + subtypePattern.patternPartial;
          subtypePattern.isPattern = false;
          subtypePattern.engine = null;

          addSubtypePattern(subtypePattern, patternlab);
          return subtypePattern;
        }
      } catch (err) {
        // no file exists, meaning it's a pattern markdown file
        if (err.code !== 'ENOENT') {
          console.log(err);
        }
      }
    }

    // extract some information
    var filename = fileObject.base;
    var ext = fileObject.ext;
    var patternsPath = patternlab.config.paths.source.patterns;

    // skip non-pattern files
    if (!patternEngines.isPatternFile(filename, patternlab)) { return null; }

    // make a new Pattern Object
    var pattern = new Pattern(relPath);

    // create subtypePattern if it doesn't already exist
    var subtypeKey = 'viewall-' + pattern.patternGroup + '-' + pattern.patternSubGroup;
    if (pattern.patternSubGroup && !patternlab.subtypePatterns[subtypeKey]) {
      var subtypePattern = {
        subdir: pattern.subdir,
        patternName: pattern.patternSubGroup,
        patternLink: pattern.flatPatternPath + '/index.html',
        patternGroup: pattern.patternGroup,
        patternSubGroup: pattern.patternSubGroup,
        flatPatternPath: pattern.flatPatternPath,
        patternPartial: subtypeKey,
        patternSectionSubtype: true
      };
      addSubtypePattern(subtypePattern, patternlab);
    }

    // if file is named in the syntax for variants
    if (patternEngines.isPseudoPatternJSON(filename)) {
      addPattern(pattern, patternlab);
      return pattern;
    }

    // can ignore all non-supported files at this point
    if (patternEngines.isFileExtensionSupported(ext) === false) {
      return pattern;
    }

    // see if this file has a state
    setState(pattern, patternlab, true);

    // look for a json file for this template
    var jsonFilename = '';
    var jsonFilenameStats;
    var jsonFileStr = '';
    try {
      var jsonFilename = path.resolve(patternsPath, pattern.subdir, pattern.fileName + '.json');
      var jsonFilenameStats = fs.statSync(jsonFilename);
    } catch (err) {
      // not a file
    }

    if (jsonFilenameStats && jsonFilenameStats.isFile()) {
      try {
        jsonFileStr = fs.readFileSync(jsonFilename, 'utf8');
        pattern.jsonFileData = JSON5.parse(jsonFileStr);
        if (patternlab.config.debug) {
          console.log('processPatternIterative: found pattern-specific data.json for ' + pattern.patternPartial);
        }
      } catch (err) {
        console.log('There was an error parsing sibling JSON for ' + pattern.relPath);
        console.log(err);
      }
    }

    // look for a listitems.json file for this template
    try {
      var listJsonFileName = path.resolve(patternsPath, pattern.subdir, pattern.fileName + '.listitems.json');
      try {
        var listJsonFileStats = fs.statSync(listJsonFileName);
      } catch (err) {
        // not a file
      }
      if (listJsonFileStats && listJsonFileStats.isFile()) {
        pattern.listitems = fs.readJSONSync(listJsonFileName);
        if (patternlab.config.debug) {
          console.log('found pattern-specific listitems.json for ' + pattern.patternPartial);
        }
        buildListItems(pattern);
        plutils.mergeData(patternlab.listitems, pattern.listitems);

      } else {
        // if not set by local listitems.json file, create reference to patternlab.listitems
        pattern.listitems = patternlab.listitems;
      }
    } catch (err) {
      console.log('There was an error parsing sibling listitem JSON for ' + pattern.relPath);
      console.log(err);
    }

    // look for a markdown file for this template
    parsePatternMarkdown(pattern, patternlab);

    // add the raw template to memory
    pattern.template = fs.readFileSync(path.resolve(patternsPath, relPath), 'utf8');
    pattern.extendedTemplate = '';

    // add pattern to patternlab.patterns array
    addPattern(pattern, patternlab);

    // save a partialObj interface to this pattern
    pattern.partialInterface = getPartialInterface(pattern);

    return pattern;
  }

  function preRenderPartial(pattern, patternlab) {
    var pseudopattern_hunter = new pph();

    var hasPseudoPattern = 0;
    var i;
    var patternVariants;
    var tmpPartial;

    if (pattern.jsonFileData) {
      // if this has local data, create non-referenced allData and dataKeys properties for this pattern
      pattern.allData = plutils.mergeData(patternlab.data, pattern.jsonFileData);

      // add allData keys to pattern.dataKeys
      pattern.dataKeys = patternlab.dataKeys.slice();
      getDataKeys(pattern.jsonFileData).filter(function (value) {
        if (!~(patternlab.dataKeys.indexOf(value))) {
          pattern.dataKeys.push(value);
        }
      });
    } else {
      pattern.jsonFileData = {};

      // if no local data, create references to patternlab.allData and patternlab.dataKeys
      pattern.allData = patternlab.data;
      pattern.dataKeys = patternlab.dataKeys;
    }

    patternVariants = pseudopattern_hunter.find_pseudopatterns(pattern, patternlab);
    hasPseudoPattern = patternVariants.length;

    for (i = 0; i < patternVariants.length; i++) {
      patternVariants[i].dataKeys.filter(function (value) {
        if (!~(pattern.dataKeys.indexOf(value))) {
          pattern.dataKeys.push(value);
        }
      });
    }

    tmpPartial = JSON.parse(pattern.partialInterface);
    tmpPartial.key = '{{> ' + pattern.relPathTrunc + ' }}';
    tmpPartial.partial = pattern.relPathTrunc;

    return {tmpPartial: tmpPartial, hasPseudoPattern: hasPseudoPattern};
  }

  function renderPartials(partial, pattern, patternlab) {
    var lineage_hunter = new lh();

    var contentRendered = partial.content;
    var dataKey;
    var dataRegex;
    var dataRegexStr = '';
    var dataTag;
    var engine = pattern.engine;
    var i;
    var key;
    var newPartial;
    var nestedPattern;
    var nestedPatternName;
    var nestedPatternNameMatch;
    var nestedPartials;

    var unusedDataKeys = partial.nestedDataKeys.filter(function (value) {
      dataKey = value.slice(3, -2).trim();
      return !~(pattern.dataKeys.indexOf(dataKey));
    });

    for (i = 0; i < unusedDataKeys.length; i++) {
      dataTag = engine.escapeReservedRegexChars(unusedDataKeys[i]);
      dataKey = engine.escapeReservedRegexChars(unusedDataKeys[i].slice(3, -2).trim());
      dataRegexStr += dataTag + '[\\S\\s]*?\\{\\{\\/\\s*' + dataKey + '\\s*\\}\\}|';
    }

    if (dataRegexStr) {
      // removing empty lines reduces rendering time considerably.
      dataRegexStr += '\\s*\\n';
      dataRegex = new RegExp('(' + dataRegexStr + ')', 'g');
      contentRendered = contentRendered.replace(dataRegex, '');
    }
    partial.contentRendered = contentRendered;

    // find pattern lineage
    lineage_hunter.find_lineage(contentRendered, pattern, patternlab);
    nestedPartials = engine.findPartials(contentRendered) || [];

    for (i = 0; i < nestedPartials.length; i++) {
      key = nestedPartials[i];
      if (!patternlab.partials[key]) {
        nestedPatternNameMatch = key.match(engine.findPartialKeyRE);
        nestedPatternName = nestedPatternNameMatch && nestedPatternNameMatch[1] ? nestedPatternNameMatch[1] : '';
        nestedPattern = getPartial(nestedPatternName, patternlab);
        if (nestedPattern) {
          try {
            engine.registerPartial(key, nestedPattern, patternlab, getPartial);
          } catch (err) {
            console.log(err);
            continue;
          }
        } else {
          continue;
        }
      }

      newPartial = JSON.parse(patternlab.partials[key]);

      partial.nestedPartials.push(newPartial);
      renderPartials(newPartial, pattern, patternlab);
    }
  }

  function extendPartials(partialObj, engine) {
    var extendedTemplate = partialObj.contentRendered;
    var i;
    var nestedPartial;

    for (i = 0; i < partialObj.nestedPartials.length; i++) {
      nestedPartial = partialObj.nestedPartials[i];
      extendedTemplate = extendedTemplate.replace(nestedPartial.key, extendPartials(nestedPartial, engine));
    }

    return extendedTemplate;
  }

  function processPatternRecursive(pattern, patternIndex, patternlab, partial) {
    var list_item_hunter = new lih();

    var hasPseudoPattern = 0;
    var preRenderObj;
    var tmpPartial;

    // skip markdown patterns
    if (pattern.engine === null) { return; }

    // the tilde suffix will sort pseudopatterns after basePatterns
    // so first, check if this is not a pseudopattern (therefore a basePattern) and look for its pseudopattern variants
    if (!patternEngines.isPseudoPatternJSON(pattern.relPath)) {
      preRenderObj = preRenderPartial(pattern, patternlab);
      tmpPartial = preRenderObj.tmpPartial;
      hasPseudoPattern = preRenderObj.hasPseudoPattern;
      renderPartials(tmpPartial, pattern, patternlab);
      pattern.extendedTemplate = extendPartials(tmpPartial, pattern.engine);

      list_item_hunter.processListItemPartials(pattern, patternlab);

    // identified a pseudopattern by checking if this is a file containing same name, with ~ in it, ending in .json
    // copy its basePattern.extendedTemplate to extendedTemplate and return
    } else {
      pattern.extendedTemplate = pattern.basePattern.extendedTemplate;

      // clear basePattern.extendedTemplate if no more pseudoPatterns of this basePattern
      if (
        typeof patternlab.patterns[patternIndex + 1] === 'undefined' ||
        (
          patternlab.patterns[patternIndex + 1].basePattern &&
          patternlab.patterns[patternIndex + 1].basePattern !== patternlab.patterns[patternIndex].basePattern
        )
      ) {
        patternlab.patterns[patternIndex].basePattern.extendedTemplate = '';
      }
    }

    var head;
    if (patternlab.userHead) {
      head = patternlab.userHead.replace('{{{ patternLabHead }}}', patternlab.header);
    } else {
      head = patternlab.header;
    }

    pattern.patternLineages = pattern.lineage;
    pattern.patternLineageExists = pattern.lineage.length > 0;
    pattern.patternLineagesR = pattern.lineageR;
    pattern.patternLineageRExists = pattern.lineageR.length > 0;
    pattern.patternLineageEExists = pattern.patternLineageExists || pattern.patternLineageRExists;

    // set cacheBuster property if not already set
    if (!pattern.allData.cacheBuster) {
      pattern.allData.cacheBuster = patternlab.cacheBuster;
    }

    var headHTML = renderPattern(head, pattern.allData);
    pattern.patternPartialCode = renderPattern(pattern, pattern.allData);

    // stringify these data for individual pattern rendering and use on the styleguide
    // see if patternData really needs these other duped values
    pattern.allData.patternData = JSON.stringify({
      cssEnabled: false,
      patternLineageExists: pattern.patternLineageExists,
      patternLineages: pattern.patternLineages,
      lineage: pattern.patternLineages,
      patternLineageRExists: pattern.patternLineageRExists,
      patternLineagesR: pattern.patternLineagesR,
      lineageR: pattern.patternLineagesR,
      patternLineageEExists: pattern.patternLineageExists || pattern.patternLineageRExists,
      patternDesc: pattern.patternDescExists ? pattern.patternDesc : '',
      patternBreadcrumb:
        pattern.patternGroup === pattern.patternSubGroup ?
        {
          patternType: pattern.patternGroup
        } : {
          patternType: pattern.patternGroup,
          patternSubtype: pattern.patternSubGroup
        },
      patternExtension: pattern.fileExtension.substr(1), // remove the dot because styleguide asset default adds it
      patternName: pattern.patternName,
      patternPartial: pattern.patternPartial,
      patternState: pattern.patternState,
      extraOutput: {}
    });

    // set the pattern-specific footer by compiling the general-footer with data, and then adding it to the meta footer
    var footerPartial = renderPattern(patternlab.footer, {
      isPattern: pattern.isPattern,
      patternData: pattern.allData.patternData,
      patternPartial: pattern.patternPartial,
      lineage: JSON.stringify(pattern.patternLineages),
      patternState: pattern.patternState,
      cacheBuster: patternlab.cacheBuster
    });

    var footerHTML = patternlab.userFoot.replace('{{{ patternLabFoot }}}', footerPartial);
    footerHTML = renderPattern(footerHTML, pattern.allData);
    pattern.header = headHTML;
    pattern.footer = footerHTML;

    // default the output suffixes if not present
    var outputFileSuffixes = {
      rendered: '',
      rawTemplate: '',
      markupOnly: '.markup-only',
      escaped: '.escaped'
    }
    outputFileSuffixes = _.extend(outputFileSuffixes, patternlab.config.outputFileSuffixes);

    // write the compiled template to the public patterns directory
    var paths = patternlab.config.paths;
    var patternPage = pattern.header + pattern.patternPartialCode;

    fs.outputFileSync(
      paths.public.patterns + pattern.patternLink.replace('.html', outputFileSuffixes.rendered + '.html'), patternPage);

    // write the mustache file too
    fs.outputFileSync(
      paths.public.patterns + pattern.patternLink.replace(
        '.html', outputFileSuffixes.rawTemplate + pattern.fileExtension
      ),
      pattern.template
    );

    // write the markup-only version too
    fs.outputFileSync(
      paths.public.patterns + pattern.patternLink.replace('.html', outputFileSuffixes.markupOnly + '.html'),
      pattern.patternPartialCode
    );

    // free memory
    for (var key in pattern) {
      if (pattern.hasOwnProperty(key)) {
        switch (key) {
          case 'relPath':
          case 'relPathTrunc':
          case 'subdir':
          case 'fileName':
          case 'name':
          case 'patternBaseName':
          case 'patternName':
          case 'patternLink':
          case 'patternGroup':
          case 'patternSubGroup':
          case 'flatPatternPath':
          case 'patternPartial':
          case 'isPattern':
          case 'patternState':
          case 'template':
          case 'partialInterface':
          case 'patternLineagesR':
          case 'lineageR':
          case 'lineageRIndex':
          case 'extendedTemplate':
          case 'footer':
            continue;
        }
        if (typeof pattern[key] === 'string') {
          pattern[key] = '';
        } else {
          pattern[key] = null;
        }
      }
    }

    if (!hasPseudoPattern) {
      pattern.extendedTemplate = '';
    }
  }

  return {
    getPartial: function (partial, patternlab) {
      return getPartial(partial, patternlab);
    },
    buildListItems: function (patternlab) {
      buildListItems(patternlab);
    },
    setState: function (pattern, patternlab, displayDeprecatedWarning) {
      setState(pattern, patternlab, displayDeprecatedWarning);
    },
    addPattern: function (pattern, patternlab) {
      addPattern(pattern, patternlab);
    },
    addSubtypePattern: function (subtypePattern, patternlab) {
      addSubtypePattern(subtypePattern, patternlab);
    },
    renderPattern: function (template, data, partials) {
      return renderPattern(template, data, partials);
    },
    parsePatternMarkdown: function (pattern, patternlab) {
      parsePatternMarkdown(pattern, patternlab);
    },
    getDataKeys: function (data, uniqueKeys) {
      return getDataKeys(data, uniqueKeys);
    },
    getPartialInterface: function (pattern) {
      return getPartialInterface(pattern);
    },
    processPatternIterative: function (file, patternlab) {
      return processPatternIterative(file, patternlab);
    },
    preRenderPartial: function (pattern, patternlab) {
      return preRenderPartial(pattern, patternlab);
    },
    renderPartials: function (tmpPartial, pattern, patternlab) {
      renderPartials(tmpPartial, pattern, patternlab);
    },
    extendPartials: function (partialObj, engine) {
      return extendPartials(partialObj, engine);
    },
    processPatternRecursive: function (pattern, index, patternlab) {
      processPatternRecursive(pattern, index, patternlab);
    }
  };
};

module.exports = pattern_assembler;
