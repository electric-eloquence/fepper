/* 
 * patternlab-node - v0.13.0 - 2015 
 * 
 * Brian Muenzenmeyer, and the web community.
 * Licensed under the MIT license. 
 * 
 * Many thanks to Brad Frost and Dave Olsen for inspiration, encouragement, and advice. 
 *
 */

(function () {
  "use strict";

  var pattern_assembler = function(){

    function isObjectEmpty(obj) {
      for(var prop in obj) {
          if(obj.hasOwnProperty(prop))
              return false;
      }

      return true;
    }


    //find and return any {{> template-name }} within pattern
    function findPartials(pattern){
      var matches = pattern.template.match(/{{>([ ])?([\w\-\.\/~]+)(?:\:[A-Za-z0-9-]+)?(?:(| )\([^\)]*\))?([\s])*}}/g);
      return matches;
    }

    function findPartialsExtended(template){
      var extended = {};
      extended.template = template;
      var matches = findPartials(extended);
      return matches;
    }

    function findListItems(pattern){
      var matches = pattern.template.match(/({{#( )?)(listItems.)(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)( )?}}/g);
      return matches;
    }

    function setState(pattern, patternlab){
      if(patternlab.config.patternStates[pattern.patternName]){
        pattern.patternState = patternlab.config.patternStates[pattern.patternName];
      } else{
        pattern.patternState = "";
      }
    }

    function addPattern(pattern, patternlab){
      patternlab.data.link[pattern.patternGroup + '-' + pattern.patternName] = '/patterns/' + pattern.patternLink;

      //only push to array if the array doesn't contain this pattern
      var isNew = true;
      for(var i = 0; i < patternlab.patterns.length; i++){
        //so we need the identifier to be unique, which patterns[i].abspath is
        if(pattern.abspath === patternlab.patterns[i].abspath){
          //if abspath already exists, overwrite that element
          patternlab.patterns[i] = pattern;
          isNew = false;
          break;
        }
      }
      //if the pattern is new, just push to the array
      if(isNew){
        patternlab.patterns.push(pattern);
      }
    }

    function renderPattern(template, data, partials) {

      var mustache = require('mustache');

      if(partials) {
        return mustache.render(template, data, partials);
      } else{
        return mustache.render(template, data);
      }
    }

    function processPatternIterative(file, patternlab){
      var fs = require('fs-extra'),
      of = require('./object_factory'),
      path = require('path');

      //extract some information
      var subdir = path.dirname(path.relative(patternlab.config.patterns.source, file)).replace('\\', '/');
      var filename = path.basename(file);
      var ext = path.extname(filename);

      //ignore dotfiles and non-variant .json files
      if(filename.charAt(0) === '.' || (ext === '.json' && filename.indexOf('~') === -1)){
        return;
      }

      //make a new Pattern Object
      var currentPattern = new of.oPattern(file, subdir, filename);

      //if file is named in the syntax for variants
      if(ext === '.json' && filename.indexOf('~') > -1){
        //add current pattern to patternlab object with minimal data
        //processPatternRecursive() will run find_pseudopatterns() to fill out
        //the object in the next diveSync
        addPattern(currentPattern, patternlab);
        //no need to process further
        return;
      }

      //can ignore all non-mustache files at this point
      if(ext !== '.mustache'){
        return;
      }

      //see if this file has a state
      setState(currentPattern, patternlab);

      //look for a json file for this template
      try {
        var jsonFilename = patternlab.config.patterns.source + currentPattern.subdir + '/' + currentPattern.fileName  + ".json";
        currentPattern.jsonFileData = fs.readJSONSync(jsonFilename.substring(2));
        if(patternlab.config.debug){
          console.log('found pattern-specific data.json for ' + currentPattern.key);
        }
      }
      catch(e) {
      }

      //look for a listitems.json file for this template
      try {
        var listJsonFileName = patternlab.config.patterns.source + currentPattern.subdir + '/' + currentPattern.fileName  + ".listitems.json";
        currentPattern.patternSpecificListJson = fs.readJSONSync(listJsonFileName.substring(2));
        if(patternlab.config.debug){
          console.log('found pattern-specific listitems.json for ' + currentPattern.key);
        }
      }
      catch(e) {
      }

      //add the raw template to memory
      currentPattern.template = fs.readFileSync(file, 'utf8');
      currentPattern.extendedTemplate = currentPattern.template;

      //add currentPattern to patternlab.patterns array
      addPattern(currentPattern, patternlab);
    }

    function processPatternRecursive(currentPattern, patternlab, startFile){

      var fs = require('fs-extra'),
      mustache = require('mustache'),
      lh = require('./lineage_hunter'),
      ph = require('./parameter_hunter'),
      pph = require('./pseudopattern_hunter'),
      lih = require('./list_item_hunter'),
      path = require('path');

      var parameter_hunter = new ph(),
      lineage_hunter = new lh(),
      list_item_hunter = new lih(),
      pseudopattern_hunter = new pph();

      var extendedTemplate;

      if(currentPattern.parameterizedTemplate){
        extendedTemplate = currentPattern.parameterizedTemplate;
        //for each recursion, unset parameterizedTemplate property
        currentPattern.parameterizedTemplate = null;

      } else{
        extendedTemplate = currentPattern.template;
        //for each recursion, reset extendedTemplate property
        currentPattern.extendedTemplate = currentPattern.template;
      }

      //return if processing an empty template
      if(!extendedTemplate){
        return '';
      }

      if(patternlab.config.debug){
        console.log('found partials for ' + currentPattern.key);
      }

      //find any listItem partials
      extendedTemplate = list_item_hunter.process_list_item_partials(currentPattern, patternlab, extendedTemplate, startFile);

      //find how many partials there may be for the given pattern
      var foundPatternPartials = findPartialsExtended(extendedTemplate);

      if(foundPatternPartials === null){
        return extendedTemplate;
      }

      var startPattern = getpatternbykey(startFile, patternlab);

      //iterate through foundPatternPartials
      for(var i = 0; i < foundPatternPartials.length; i++){
        var partialKey = foundPatternPartials[i].replace(/{{>([ ])?([\w\-\.\/~]+)(?:\:[A-Za-z0-9-]+)?(?:(| )\([^\)]*\))?([\s])*}}/g, '$2');

        //identify which pattern this partial corresponds to
        var partialPattern = getpatternbykey(partialKey, patternlab);
        partialPattern.extendedTemplate = partialPattern.template;

        //determine if the partial is parameterized or not
        var parameterizedPartial = foundPatternPartials[i].match(/{{>([ ])?([\w\-\.\/~]+)(\()([^)]+)(\))([\s])*}}/);

        var partialTemplateTmp;

        //build out extendedTemplate
        if(!parameterizedPartial){
          //regular old partials just recurse
          partialTemplateTmp = processPatternRecursive(partialPattern, patternlab, startFile);
          currentPattern.extendedTemplate = extendedTemplate = extendedTemplate.replace(foundPatternPartials[i], partialTemplateTmp);

        } else{
          //parameterized partials run find_parameters(), process_list_item_partials, and then recurse
          partialTemplateTmp = parameter_hunter.find_parameters(currentPattern, patternlab, foundPatternPartials[i], startPattern);
          partialTemplateTmp = list_item_hunter.process_list_item_partials(partialPattern, patternlab, partialTemplateTmp, startFile);
          partialPattern.parameterizedTemplate = partialTemplateTmp;
          partialTemplateTmp = processPatternRecursive(partialPattern, patternlab, startFile);

          // after all those operations, set extendedTemplate property on currentPattern
          currentPattern.extendedTemplate = extendedTemplate = extendedTemplate.replace(foundPatternPartials[i], partialTemplateTmp);
        }
      }

      //find pattern lineage
      lineage_hunter.find_lineage(currentPattern, patternlab);

      //add to patternlab object so we can look these up later.
      addPattern(currentPattern, patternlab);

      //look for a pseudo pattern by checking if there is a file containing same name, with ~ in it, ending in .json
      pseudopattern_hunter.find_pseudopatterns(currentPattern, patternlab);

      return currentPattern.extendedTemplate;
    }

    function getpatternbykey(key, patternlab){
      for(var i = 0; i < patternlab.patterns.length; i++){
        switch(key){
          case patternlab.patterns[i].key:
          case patternlab.patterns[i].subdir + '/' + patternlab.patterns[i].fileName:
          case patternlab.patterns[i].subdir + '/' + patternlab.patterns[i].fileName + '.mustache':
          case patternlab.patterns[i].abspath:
          case './' + patternlab.patterns[i].abspath:
            return patternlab.patterns[i];
        }
      }
      if(patternlab.config.debug){
        throw 'Could not find pattern with key ' + key;
      }
      return null;
    }

    /**
     * Recursively merge properties of two objects.
     *
     * @param {Object} obj1 If obj1 has properties obj2 doesn't, add to obj2.
     * @param {Object} obj2 This object's properties have priority over obj1.
     * @returns {Object} obj2
     */
    function mergeData(obj1, obj2){
      if(typeof obj2 === 'undefined'){
        obj2 = {};
      }
      for(var p in obj1){
        try {
          // Only recurse if obj1[p] is an object.
          if(obj1[p].constructor === Object){
            // Requires 2 objects as params; create obj2[p] if undefined.
            if(typeof obj2[p] === 'undefined'){
              obj2[p] = {};
            }
            obj2[p] = mergeData(obj1[p], obj2[p]);
          // Pop when recursion meets a non-object. If obj1[p] is a non-object,
          // only copy to undefined obj2[p]. This way, obj2 maintains priority.
          } else if(typeof obj2[p] === 'undefined'){
            obj2[p] = obj1[p];
          }
        } catch(e) {
          // Property in destination object not set; create it and set its value.
          if(typeof obj2[p] === 'undefined'){
            obj2[p] = obj1[p];
          }
        }
      }
      return obj2;
    }

    function buildListItems(patternlab){
      //combine all list items into one structure
      var list = [];
      for (var item in patternlab.listitems) {
        if( patternlab.listitems.hasOwnProperty(item)) {
          list.push(patternlab.listitems[item]);
        }
      }
      patternlab.listItemArray = shuffle(list);

      for(var i = 1; i <= patternlab.listItemArray.length; i++){
        var tempItems = [];
        if( i === 1){
          tempItems.push(patternlab.listItemArray[0]);
          patternlab.listitems['' + i ] = tempItems;
        } else{
          for(var c = 1; c <= i; c++){
            tempItems.push(patternlab.listItemArray[c - 1]);
            patternlab.listitems['' + i ] = tempItems;
          }
        }
      }
    }

    //http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
    function shuffle(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    return {
      find_pattern_partials: function(pattern){
        return findPartials(pattern);
      },
      find_pattern_partials_extended: function(template){
        return findPartialsExtended(template);
      },
      find_list_items: function(pattern){
        return findListItems(pattern)
      },
      setPatternState: function(pattern, patternlab){
        setState(pattern, patternlab);
      },
      addPattern: function(pattern, patternlab){
        addPattern(pattern, patternlab);
      },
      renderPattern: function(template, data, partials){
        return renderPattern(template, data, partials);
      },
      process_pattern_iterative: function(file, patternlab){
        processPatternIterative(file, patternlab);
      },
      process_pattern_recursive: function(pattern, patternlab, startFile){
        return processPatternRecursive(pattern, patternlab, startFile);
      },
      get_pattern_by_key: function(key, patternlab){
        return getpatternbykey(key, patternlab);
      },
      merge_data: function(existingData, newData){
        return mergeData(existingData, newData);
      },
      combine_listItems: function(patternlab){
        buildListItems(patternlab);
      },
      is_object_empty: function(obj){
        return isObjectEmpty(obj);
      }
    };

  };

  module.exports = pattern_assembler;

}());
