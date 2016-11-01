/* 
 * patternlab-node - v2.3.0 - 2016 
 * 
 * Brian Muenzenmeyer, Geoff Pursell, and the web community.
 * Licensed under the MIT license. 
 * 
 * Many thanks to Brad Frost and Dave Olsen for inspiration, encouragement, and advice. 
 *
 */

"use strict";

var diveSync = require('diveSync'),
  glob = require('glob'),
  _ = require('lodash'),
  path = require('path');

// GTP: these two diveSync pattern processors factored out so they can be reused
// from unit tests to reduce code dupe!

function buildPatternData(dataFilesPath, fs) {
  var dataFilesPath = dataFilesPath;
  var dataFiles = glob.sync(dataFilesPath + '*.json', {"ignore" : [dataFilesPath + 'listitems.json']});
  var mergeObject = {}
  dataFiles.forEach(function (filePath) {
    var jsonData = fs.readJSONSync(path.resolve(filePath), 'utf8')
    mergeObject = _.merge(mergeObject, jsonData)
  })
  return mergeObject;
}

function processAllPatternsIterative(pattern_assembler, patterns_dir, patternlab) {
  diveSync(
    patterns_dir,
    function (err, file) {
      //log any errors
      if (err) {
        console.log(err);
        return;
      }
      pattern_assembler.process_pattern_iterative(path.relative(patterns_dir, file), patternlab);
    }
  );
}

function processAllPatternsRecursive(pattern_assembler, patterns_dir, patternlab) {
  for (var i = 0; i < patternlab.patterns.length; i++) {
    pattern_assembler.process_pattern_recursive(patternlab.patterns[i], i, patternlab);
  }
}

var patternlab_engine = function (config) {
  'use strict';

  var fs = require('fs-extra'),
    pa = require('./pattern_assembler'),
    pe = require('./pattern_exporter'),
    lh = require('./lineage_hunter'),
    lih = require('./list_item_hunter'),
    buildFrontEnd = require('./ui_builder'),
    plutils = require('./utilities'),
    sm = require('./starterkit_manager'),
    patternlab = {};

  patternlab.package = fs.readJSONSync(path.resolve(__dirname, '../../package.json'));
  patternlab.config = config || fs.readJSONSync(path.resolve(__dirname, '../../patternlab-config.json'));

  var paths = patternlab.config.paths;

  function getVersion() {
    console.log(patternlab.package.version);
  }


  function help() {
    console.log('');

    console.log('|=======================================|');
    plutils.logGreen('     Pattern Lab Node Help v' + patternlab.package.version);
    console.log('|=======================================|');

    console.log('');
    console.log('Command Line Interface - usually consumed by an edition');
    console.log('');

    plutils.logGreen(' patternlab:build');
    console.log('   > Compiles the patterns and frontend, outputting to config.paths.public');
    console.log('');

    plutils.logGreen(' patternlab:patternsonly');
    console.log('   > Compiles the patterns only, outputting to config.paths.public');
    console.log('');

    plutils.logGreen(' patternlab:version');
    console.log('   > Return the version of patternlab-node you have installed');
    console.log('');

    plutils.logGreen(' patternlab:help');
    console.log('   > Get more information about patternlab-node, pattern lab in general, and where to report issues.');
    console.log('');

    plutils.logGreen(' patternlab:liststarterkits');
    console.log('   > Returns a url with the list of available starterkits hosted on the Pattern Lab organization Github account');
    console.log('');

    plutils.logGreen(' patternlab:loadstarterkit');
    console.log('   > Load a starterkit into config.paths.source/*');
    console.log('   > NOTE: Overwrites existing content, and only cleans out existing directory if --clean=true argument is passed.');
    console.log('   > NOTE: In most cases, `npm install starterkit-name` will precede this call.');
    console.log('   > arguments:');
    console.log('      -- kit ');
    console.log('      > the name of the starter kit to load');
    console.log('      -- clean ');
    console.log('      > removes all files from config.paths.source/ prior to load');
    console.log('   > example (gulp):');
    console.log('    `gulp patternlab:loadstarterkit --kit=starterkit-mustache-demo`');
    console.log('');

    console.log('===============================');
    console.log('');
    console.log('Visit http://patternlab.io/ for more info about Pattern Lab');
    console.log('Visit https://github.com/pattern-lab/patternlab-node/issues to open an issue.');
    console.log('Visit https://github.com/pattern-lab/patternlab-node/wiki to view the changelog, roadmap, and other info.');
    console.log('');
    console.log('===============================');
  }

  function printDebug() {
    // A replacer function to pass to stringify below; this is here to prevent
    // the debug output from blowing up into a massive fireball of circular
    // references. This happens specifically with the Handlebars engine. Remove
    // if you like 180MB log files.
    function propertyStringReplacer(key, value) {
      if (key === 'engine' && value && value.engineName) {
        return '{' + value.engineName + ' engine object}';
      }
      return value;
    }

    //debug file can be written by setting flag on patternlab-config.json
    if (patternlab.config.debug) {
      console.log('writing patternlab debug file to ./patternlab.json');
      fs.outputFileSync('./patternlab.json', JSON.stringify(patternlab, propertyStringReplacer, 3));
    }
  }

  function setCacheBust() {
    if (patternlab.config.cacheBust) {
      if (patternlab.config.debug) {
        console.log('setting cacheBuster value for frontend assets.');
      }
      patternlab.cacheBuster = new Date().getTime();
    } else {
      patternlab.cacheBuster = 0;
    }
  }

  function listStarterkits() {
    var starterkit_manager = new sm(patternlab);
    return starterkit_manager.list_starterkits();
  }

  function loadStarterKit(starterkitName, clean) {
    var starterkit_manager = new sm(patternlab);
    starterkit_manager.load_starterkit(starterkitName, clean);
  }

  function buildPatterns(deletePatternDir) {
    var list_item_hunter = new lih();
    var pattern_assembler = new pa();

    try {
      patternlab.data = buildPatternData(paths.source.data, fs);
    } catch (ex) {
      plutils.logRed('missing or malformed' + paths.source.data + 'data.json  Pattern Lab may not work without this file.');
      patternlab.data = {};
    }
    try {
      patternlab.listitems = fs.readJSONSync(path.resolve(paths.source.data, 'listitems.json'));
    } catch (ex) {
      plutils.logRed('missing or malformed' + paths.source.data + 'listitems.json  Pattern Lab may not work without this file.');
      patternlab.listitems = {};
    }
    try {
      patternlab.header = fs.readFileSync(path.resolve(paths.source.patternlabFiles, 'partials', 'general-header.mustache'), 'utf8');
      patternlab.footer = fs.readFileSync(path.resolve(paths.source.patternlabFiles, 'partials', 'general-footer.mustache'), 'utf8');
      patternlab.patternSection = fs.readFileSync(path.resolve(paths.source.patternlabFiles, 'partials', 'patternSection.mustache'), 'utf8');
      patternlab.patternSectionSubType = fs.readFileSync(path.resolve(paths.source.patternlabFiles, 'partials', 'patternSectionSubtype.mustache'), 'utf8');
      patternlab.viewAll = fs.readFileSync(path.resolve(paths.source.patternlabFiles, 'viewall.mustache'), 'utf8');
    } catch (ex) {
      console.log(ex);
      plutils.logRed('\nERROR: missing an essential file from ' + paths.source.patternlabFiles + '. Pattern Lab won\'t work without this file.\n');
      process.exit(1);
    }
    patternlab.patterns = [];
    patternlab.subtypePatterns = {};
    patternlab.partials = {};
    patternlab.data.link = {};

    setCacheBust();

    var pattern_assembler = new pa(),
      pattern_exporter = new pe(),
      lineage_hunter = new lh(),
      list_item_hunter = new lih(),
      patterns_dir = paths.source.patterns;

    pattern_assembler.combine_listItems(patternlab);

    var Pattern = require('./object_factory').Pattern;
    var patternEngines = require('./pattern_engines');
    var dummyPattern = Pattern.createEmpty();
    var engine = patternEngines.getEngineForPattern(dummyPattern);

    // diveSync once to perform iterative populating of patternlab object
    processAllPatternsIterative(pattern_assembler, patterns_dir, patternlab);

    // push list item keywords into dataKeys property
    patternlab.dataKeys = ['styleModifier'].concat(pattern_assembler.get_data_keys(patternlab.data));

    for (var i = 0; i < list_item_hunter.items.length; i++) {
      patternlab.dataKeys.push('listItems.' + list_item_hunter.items[i]);
      patternlab.dataKeys.push('listitems.' + list_item_hunter.items[i]);
    }

    //set user defined head and foot if they exist
    try {
      patternlab.userHead = fs.readFileSync(path.resolve(paths.source.meta, '_00-head.mustache'), 'utf8');
    }
    catch (ex) {
      if (patternlab.config.debug) {
        console.log(ex);
        console.log('Could not find optional user-defined header, usually found at ./source/_meta/_00-head.mustache. It was likely deleted.');
      }
    }
    try {
      patternlab.userFoot = fs.readFileSync(path.resolve(paths.source.meta, '_01-foot.mustache'), 'utf8');
    }
    catch (ex) {
      if (patternlab.config.debug) {
        console.log(ex);
        console.log('Could not find optional user-defined footer, usually found at ./source/_meta/_01-foot.mustache. It was likely deleted.');
      }
    }

    //delete the contents of config.patterns.public before writing
    if (deletePatternDir) {
      fs.removeSync(paths.public.patterns);
      fs.emptyDirSync(paths.public.patterns);
    }

    //set pattern-specific header if necessary
    var head;
    if (patternlab.userHead) {
      head = patternlab.userHead.replace('{{{ patternLabHead }}}', patternlab.header);
    } else {
      head = patternlab.header;
    }
    patternlab.footer = patternlab.footer.replace('{{# lineageR }} = {{{ lineageR }}}{{/ lineageR }}', '\u0002# lineageR }} = \u0002{ lineageR }}}\u0002/ lineageR }}');

    //diveSync again to recursively include partials, filling out the
    //extendedTemplate property of the patternlab.patterns elements
    processAllPatternsRecursive(pattern_assembler, patterns_dir, patternlab);
    patternlab.footer = patternlab.footer.replace('\u0002# lineageR }} = \u0002{ lineageR }}}\u0002/ lineageR }}', '{{# lineageR }} = {{{ lineageR }}}{{/ lineageR }}');

    for (var i = 0; i < patternlab.patterns.length; i++) {
      var pattern = patternlab.patterns[i];

      //skip unprocessed patterns
      if (!pattern.footer) { continue; }

      //set the pattern-specific footer by compiling the general-footer with data, and then adding it to the meta footer
      var footerHTML = pattern.footer.replace('\u0002# lineageR }} = \u0002{ lineageR }}}\u0002/ lineageR }}', '{{# lineageR }} = {{{ lineageR }}}{{/ lineageR }}');
      footerHTML = engine.renderPattern(footerHTML, {lineageR: JSON.stringify(pattern.patternLineagesR)});

      fs.appendFileSync(paths.public.patterns + pattern.patternLink, footerHTML);
    }

    //export patterns if necessary
    pattern_exporter.export_patterns(patternlab);
  }

  return {
    version: function () {
      return getVersion();
    },
    build: function (callback, deletePatternDir) {
      buildPatterns(deletePatternDir);
      buildFrontEnd(patternlab);
      printDebug();
      callback();
    },
    help: function () {
      help();
    },
    patternsonly: function (callback, deletePatternDir) {
      buildPatterns(deletePatternDir);
      printDebug();
      callback();
    },
    liststarterkits: function () {
      return listStarterkits();
    },
    loadstarterkit: function (starterkitName, clean) {
      loadStarterKit(starterkitName, clean);
    }
  };
};

// export these free functions so they're available without calling the exported
// function, for use in reducing code dupe in unit tests. At least, until we
// have a better way to do this
patternlab_engine.build_pattern_data = buildPatternData;
patternlab_engine.process_all_patterns_iterative = processAllPatternsIterative;
patternlab_engine.process_all_patterns_recursive = processAllPatternsRecursive;

module.exports = patternlab_engine;
