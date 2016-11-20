'use strict';

var path = require('path');
var fs = require('fs-extra');
var ae = require('./annotation_exporter');
var of = require('./object_factory');
var pa = require('./pattern_assembler');
var pattern_assembler = new pa();
var eol = require('os').EOL;

// PRIVATE FUNCTIONS

function addToPatternPaths(patternlab, pattern) {
  if (!patternlab.patternPaths[pattern.patternGroup]) {
    patternlab.patternPaths[pattern.patternGroup] = {};
  }
  patternlab.patternPaths[pattern.patternGroup][pattern.patternBaseName] = pattern.name;
}

// todo: refactor this as a method on the pattern object itself once we merge dev with pattern-engines branch
function isPatternExcluded(pattern) {
  // returns whether the first character of the pattern type, subtype, further nested dirs, or filename is an underscore
  if (pattern.isPattern) {
    if (
      pattern.relPath.charAt(0) === '_' ||
      pattern.relPath.indexOf('/_') > -1
    ) {
      return true;
    }
  }
  return false;
}

// Returns the array of patterns to be rendered in the styleguide view and
// linked to in the pattern navigation. Checks if patterns are excluded.
function assembleStyleguidePatterns(patternlab) {
  var i;
  var j;
  var k;
  var prevSubdir = '';
  var prevGroup = '';
  var styleguideExcludes = patternlab.config.styleGuideExcludes;
  var styleguidePatterns = [];

  for (i = 0; i < patternlab.patterns.length; i++) {
    var pattern = patternlab.patterns[i];

    // skip underscore-prefixed files
    if (isPatternExcluded(pattern)) {
      if (patternlab.config.debug) {
        console.log('Omitting ' + pattern.patternPartial + ' from styleguide pattern exclusion.');
      }
      continue;
    }

    var isExcluded = false;
    if (Array.isArray(styleguideExcludes) && styleguideExcludes.length) {
      var partial = pattern.patternPartial;
      var partialType = partial.substring(0, partial.indexOf('-'));
      isExcluded = (styleguideExcludes.indexOf(partialType) > -1);
    }

    if (!isExcluded) {
      var viewAllFound = false;

      if (pattern.patternGroup !== prevGroup) {
        prevGroup = pattern.patternGroup;

        for (j in patternlab.subtypePatterns) {
          if (patternlab.subtypePatterns.hasOwnProperty(j)) {
            if (patternlab.subtypePatterns[j].patternGroup === pattern.patternGroup) {
              styleguidePatterns.push(patternlab.subtypePatterns[j]);
              break;
            }
          }
        }
      } else if (pattern.subdir !== prevSubdir && pattern.patternGroup !== pattern.patternSubGroup) {
        prevSubdir = pattern.subdir;

        for (j in patternlab.subtypePatterns) {
          if (patternlab.subtypePatterns.hasOwnProperty(j)) {
            if (patternlab.subtypePatterns[j].subdir === pattern.subdir) {
              for (k = 0; k < styleguidePatterns.length; k++) {
                if (styleguidePatterns[k].patternPartial === patternlab.subtypePatterns[j].patternPartial) {
                  viewAllFound = true;
                  break;
                }
              }

              if (!viewAllFound) {
                styleguidePatterns.push(patternlab.subtypePatterns[j]);
                break;
              }
            }
          }
        }
      }

      styleguidePatterns.push(pattern);
    }
  }
  return styleguidePatterns;
}

function buildNavigation(patternlab) {
  for (var i = 0; i < patternlab.patterns.length; i++) {

    var pattern = patternlab.patterns[i];

    var patternSubTypeName;
    var patternSubTypeItemName;
    var flatPatternItem;
    var patternSubType;
    var patternSubTypeItem;
    var viewAllPatternSubTypeItem;

    // check if the patternType already exists
    var patternTypeIndex = patternlab.patternTypeIndex.indexOf(pattern.patternGroup);
    var patternType;
    if (patternTypeIndex === -1) {
      // add the patternType
      patternType = new of.oPatternType(pattern.patternGroup);

      // add the patternType.
      patternlab.patternTypes.push(patternType);
      patternlab.patternTypeIndex.push(pattern.patternGroup);

      // create a property for this group in the patternlab.viewAllPaths array
      // the viewall property needs to be first
      patternlab.viewAllPaths[pattern.patternGroup] = {viewall: ''};

    } else {
      // else find the patternType
      patternType = patternlab.patternTypes[patternTypeIndex];
    }

    // get the patternSubType.
    // if there is one or more slashes in the subdir, get everything after
    // the last slash. if no slash, get the whole subdir string and strip
    // any numeric + hyphen prefix
    patternSubTypeName = pattern.subdir.split(path.sep).pop().replace(/^\d*\-/, '');

    // get the patternSubTypeItem
    patternSubTypeItemName = pattern.patternName.replace(/[\-~]/g, ' ');

    // assume the patternSubTypeItem does not exist.
    patternSubTypeItem = new of.oPatternSubTypeItem(patternSubTypeItemName);
    patternSubTypeItem.patternPath = pattern.patternLink;
    patternSubTypeItem.patternPartial = pattern.patternPartial;

    var isExcluded = isPatternExcluded(pattern);

    if (!isExcluded) {
      // add to patternPaths
      addToPatternPaths(patternlab, pattern);

      // add the patternState if it exists
      if (pattern.patternState) {
        patternSubTypeItem.patternState = pattern.patternState;
      }

      // test whether the pattern structure is flat or not - usually due to a template or page
      flatPatternItem = patternSubTypeName === pattern.patternGroup;
    }

    // need to define patternTypeItemsIndex and patternSubType whether or not excluded
    var patternTypeItemsIndex = patternType.patternTypeItemsIndex.indexOf(patternSubTypeName);
    if (patternTypeItemsIndex === -1) {
      patternSubType = new of.oPatternSubType(patternSubTypeName);
    }

    if (!isExcluded) {
      // if it is flat - we should not add the pattern to patternPaths
      if (flatPatternItem) {
        // add the patternSubType to patternItems
        patternType.patternItems.push(patternSubTypeItem);

      } else {
        // check again whether the patternSubType exists
        if (patternTypeItemsIndex === -1) {
          // add the patternSubType and patternSubTypeItem
          patternSubType.patternSubtypeItems.push(patternSubTypeItem);
          patternSubType.patternSubtypeItemsIndex.push(patternSubTypeItemName);
          patternType.patternTypeItems.push(patternSubType);
          patternType.patternTypeItemsIndex.push(patternSubTypeName);

        } else {
          // add the patternSubTypeItem
          patternSubType = patternType.patternTypeItems[patternTypeItemsIndex];
          patternSubType.patternSubtypeItems.push(patternSubTypeItem);
          patternSubType.patternSubtypeItemsIndex.push(patternSubTypeItemName);
        }
      }
    }

    // check if we are moving to a new subgroup in the next loop
    if (
      pattern.patternGroup !== pattern.patternSubGroup &&
      (!patternlab.patterns[i + 1] || pattern.patternSubGroup !== patternlab.patterns[i + 1].patternSubGroup)
    ) {
      // add the viewall SubTypeItem
      var viewAllPatternSubTypeItem = new of.oPatternSubTypeItem('View All');
      viewAllPatternSubTypeItem.patternPath = pattern.flatPatternPath + '/index.html';
      viewAllPatternSubTypeItem.patternPartial = 'viewall-' + pattern.patternGroup + '-' + pattern.patternSubGroup;

      patternSubType.patternSubtypeItems.push(viewAllPatternSubTypeItem);
      patternSubType.patternSubtypeItemsIndex.push('View All');

      patternlab.viewAllPaths[pattern.patternGroup][pattern.patternSubGroup] = pattern.flatPatternPath;
    }

    // check if we are moving to a new group in the next loop
    if (!patternlab.patterns[i + 1] || pattern.patternGroup !== patternlab.patterns[i + 1].patternGroup) {
      // add the viewall TypeItem
      var flatPatternPath = pattern.subdir.slice(
        0, pattern.subdir.indexOf(pattern.patternGroup) + pattern.patternGroup.length);
      var viewAllPatternItem = new of.oPatternSubTypeItem('View All');
      viewAllPatternItem.patternPath = flatPatternPath + '/index.html';
      viewAllPatternItem.patternPartial = 'viewall-' + pattern.patternGroup;

      patternType.patternItems.push(viewAllPatternItem);
      patternlab.viewAllPaths[pattern.patternGroup].viewall = flatPatternPath;
    }

    patternlab.patterns[i] = null;
  }

  return patternTypeIndex;
}

function buildFooterHTML(patternlab, patternPartial) {
  // set the pattern-specific footer by compiling the general-footer with data, and then adding it to the meta footer
  var patternPartialJson = patternPartial ? JSON.stringify({patternPartial: patternPartial}) : '{}';
  var footerPartial = pattern_assembler.renderPattern(patternlab.footer, {
    patternData: patternPartialJson,
    cacheBuster: patternlab.cacheBuster
  });
  var footerHTML = pattern_assembler.renderPattern(patternlab.userFoot, {
    patternLabFoot : footerPartial,
    cacheBuster: patternlab.cacheBuster
  });
  return footerHTML;
}

function insertPatternSubtypeDocumentationPattern(patternlab, patterns, patternPartial) {
  // attempt to find a subtype pattern before rendering
  var subtypePattern = patternlab.subtypePatterns[patternPartial];
  if (subtypePattern) {
    patterns.unshift(subtypePattern);

  } else {
    for (var i = 0; i < patterns.length; i++) {

      if (patternPartial === 'viewall-elements') {
        subtypePattern = patternlab.subtypePatterns[
          'viewall-' + patterns[i].patternGroup + '-' + patterns[i].patternSubGroup];

        var viewAllExists = false;
        for (var j = 0; j < patterns.length; j++) {
          if (
            patterns[j].patternPartial === 'viewall-' + patterns[i].patternGroup + '-' + patterns[i].patternSubGroup
          ) {
            viewAllExists = true;
          }
        }
        if (viewAllExists) {
          continue;
        }

        if (subtypePattern) {
          patterns.splice(i, 0, subtypePattern);
        }
      }
    }
  }
  return patterns;
}

function buildViewAllHTML(patternlab, patterns, patternPartial) {

  var patternsPlusSubtype = insertPatternSubtypeDocumentationPattern(patternlab, patterns, patternPartial);

  var viewAllHTML = pattern_assembler.renderPattern(patternlab.viewAll,
    {
      partials: patternsPlusSubtype,
      patternPartial: patternPartial,
      cacheBuster: patternlab.cacheBuster
    }, {
      patternSection: patternlab.patternSection,
      patternSectionSubtype: patternlab.patternSectionSubType
    });
  return viewAllHTML;
}

function buildViewAllPages(mainPageHeadHtml, patternlab, styleguidePatterns) {
  var paths = patternlab.config.paths;
  var prevSubdir = '';
  var prevGroup = '';
  var i;

  for (i = 0; i < styleguidePatterns.length; i++) {

    var pattern = styleguidePatterns[i];

    // skip underscore-prefixed files
    if (isPatternExcluded(pattern)) {
      if (patternlab.config.debug) {
        console.log('Omitting ' + pattern.patternPartial + ' from view all rendering.');
      }
      continue;
    }

    var viewAllPatterns;
    var patternPartial;
    var j;
    var footerHTML;
    var viewAllHTML;

    // create the view all for the section
    // check if the current section is different from the previous one
    if (pattern.patternGroup !== prevGroup) {
      prevGroup = pattern.patternGroup;

      viewAllPatterns = [];
      patternPartial = 'viewall-' + pattern.patternGroup;

      for (j = 0; j < styleguidePatterns.length; j++) {

        if (
          styleguidePatterns[j].patternGroup === pattern.patternGroup &&
          styleguidePatterns[j].patternPartial !== patternPartial
        ) {
          // again, skip any sibling patterns to the current one that may have underscores

          if (isPatternExcluded(styleguidePatterns[j])) {
            if (patternlab.config.debug) {
              console.log('Omitting ' + styleguidePatterns[j].patternPartial + ' from view all sibling rendering.');
            }
            continue;
          }

          viewAllPatterns.push(styleguidePatterns[j]);
        }
      }

      // render the footer needed for the viewall template
      footerHTML = buildFooterHTML(patternlab, patternPartial);

      // render the viewall template
      viewAllHTML = buildViewAllHTML(patternlab, viewAllPatterns, patternPartial);
      fs.outputFileSync(paths.public.patterns + pattern.subdir.slice(0, pattern.subdir.indexOf(pattern.patternGroup) +
        pattern.patternGroup.length) + '/index.html', mainPageHeadHtml + viewAllHTML + footerHTML);

    // create the view all for the subsection
    // check if the current sub section is different from the previous one
    } else if (pattern.subdir !== prevSubdir && pattern.patternGroup !== pattern.patternSubGroup) {
      prevSubdir = pattern.subdir;

      viewAllPatterns = [];
      patternPartial = 'viewall-' + pattern.patternGroup + '-' + pattern.patternSubGroup;

      for (j = 0; j < styleguidePatterns.length; j++) {

        if (
          styleguidePatterns[j].subdir === pattern.subdir &&
          styleguidePatterns[j].patternPartial !== patternPartial
        ) {
          // again, skip any sibling patterns to the current one that may have underscores
          if (isPatternExcluded(styleguidePatterns[j])) {
            if (patternlab.config.debug) {
              console.log('Omitting ' + styleguidePatterns[j].patternPartial + ' from view all sibling rendering.');
            }
            continue;
          }

          viewAllPatterns.push(styleguidePatterns[j]);
        }
      }

      // render the footer needed for the viewall template
      footerHTML = buildFooterHTML(patternlab, patternPartial);

      // render the viewall template
      viewAllHTML = buildViewAllHTML(patternlab, viewAllPatterns, patternPartial);

      fs.outputFileSync(
        paths.public.patterns + pattern.flatPatternPath + '/index.html', mainPageHeadHtml + viewAllHTML + footerHTML);
    }
  }
}

// MAIN BUILDER FUNCTION

function buildFrontEnd(patternlab) {
  var annotation_exporter = new ae(patternlab);
  var styleguidePatterns = [];
  var paths = patternlab.config.paths;

  patternlab.patternTypes = [];
  patternlab.patternTypeIndex = [];
  patternlab.patternPaths = {};
  patternlab.viewAllPaths = {};
  patternlab.data.cacheBuster = patternlab.cacheBuster

  // check if patterns are excluded, if not add them to styleguidePatterns
  styleguidePatterns = assembleStyleguidePatterns(patternlab);

  // set the pattern-specific header by compiling the general-header with data, and then adding it to the meta header
  var headerHTML = patternlab.userHead.replace('{{{ patternLabHead }}}', patternlab.header);
  headerHTML = pattern_assembler.renderPattern(headerHTML, patternlab.data);

  // set the pattern-specific footer by compiling the general-footer with data, and then adding it to the meta footer
  var footerHTML = buildFooterHTML(patternlab, null);

  // build the styleguide
  var styleguideHtml = pattern_assembler.renderPattern(patternlab.viewAll,
    {
      partials: styleguidePatterns,
      cacheBuster: patternlab.cacheBuster
    }, {
      patternSection: patternlab.patternSection,
      patternSectionSubtype: patternlab.patternSectionSubType
    });

  fs.outputFileSync(
    path.resolve(paths.public.styleguide, 'html/styleguide.html'), headerHTML + styleguideHtml + footerHTML);

  // build the viewall pages
  buildViewAllPages(headerHTML, patternlab, styleguidePatterns);

  // build the patternlab website
  buildNavigation(patternlab);

  // move the index file from its asset location into public root
  var patternlabSiteHtml;
  try {
    patternlabSiteHtml = fs.readFileSync(path.resolve(paths.source.styleguide, 'index.html'), 'utf8');
  } catch (error) {
    console.log(error);
    console.log('\nERROR: Could not load one or more styleguidekit assets from', paths.source.styleguide, '\n');
    process.exit(1);
  }
  fs.outputFileSync(path.resolve(paths.public.root, 'index.html'), patternlabSiteHtml);

  // write out the data
  var output = '';

  // config
  output += 'var config = ' + JSON.stringify(patternlab.config) + ';\n';

  // ishControls
  output += 'var ishControls = {"ishControlsHide":' + JSON.stringify(patternlab.config.ishControlsHide) + '};' + eol;

  // navItems
  output += 'var navItems = {"patternTypes": ' + JSON.stringify(patternlab.patternTypes) + '};' + eol;

  // patternPaths
  output += 'var patternPaths = ' + JSON.stringify(patternlab.patternPaths) + ';' + eol;

  // viewAllPaths
  output += 'var viewAllPaths = ' + JSON.stringify(patternlab.viewAllPaths) + ';' + eol;

  // plugins someday
  output += 'var plugins = [];' + eol;

  // smaller config elements
  output += 'var defaultShowPatternInfo = ';
  output += (patternlab.config.defaultShowPatternInfo ? patternlab.config.defaultShowPatternInfo : 'false') + ';' + eol;
  output += 'var defaultPattern = "' + (patternlab.config.defaultPattern ? patternlab.config.defaultPattern : 'all');
  output += '";' + eol;

  // write all ouytput to patternlab-data
  fs.outputFileSync(path.resolve(paths.public.data, 'patternlab-data.js'), output);

  // annotations
  var annotationsJSON = annotation_exporter.gather();
  var annotations = 'var comments = { "comments" : ' + JSON.stringify(annotationsJSON) + '};';
  fs.outputFileSync(path.resolve(paths.public.annotations, 'annotations.js'), annotations);

}

module.exports = buildFrontEnd;
