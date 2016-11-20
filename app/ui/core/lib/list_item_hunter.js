'use strict';

var list_item_hunter = function () {

  var extend = require('util')._extend;
  var pa = require('./pattern_assembler');
  var plutils = require('./utilities');

  var items = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
    'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

  function getEnd(liMatch) {
    return liMatch.replace('#', '/');
  }

  function getPatternBlock(pattern, liMatch, end) {
    return pattern.extendedTemplate.substring(pattern.extendedTemplate.indexOf(liMatch) +
      liMatch.length, pattern.extendedTemplate.indexOf(end));
  }

  function processListItemPartials(pattern, patternlab) {
    var pattern_assembler = new pa();

    var i;
    var j;

    // find any listitem blocks
    var matches = pattern.findListItems() || [];

    for (i = 0; i < matches.length; i++) {
      var liMatch = matches[i];

      if (patternlab.config.debug) {
        console.log('found listItem of size ' + liMatch + ' inside ' + pattern.patternPartial);
      }

      // find the boundaries of the block
      var loopNumberString = liMatch.split('.')[1].split('}')[0].trim();
      var end = getEnd(liMatch);
      var patternBlock = getPatternBlock(pattern, liMatch, end).trim();

      // build arrays that repeat the block, however large we need to
      var repeatedBlockTemplate = [];
      var repeatedBlockHtml = '';

      for (j = 0; j < items.indexOf(loopNumberString); j++) {
        if (patternlab.config.debug) {
          console.log(
            'list item(s) in pattern', pattern.patternPartial, 'adding', patternBlock, 'to repeatedBlockTemplate');
        }
        repeatedBlockTemplate.push(patternBlock);
      }

      var listData = pattern.listitems;

      // iterate over each copied block, rendering its contents along with pattenlab.listitems[i]
      for (j = 0; j < repeatedBlockTemplate.length; j++) {

        var thisBlockTemplate = repeatedBlockTemplate[j];
        var thisBlockHTML = '';

        // combine listItem data with pattern data with global data
        var itemData = listData['' + items.indexOf(loopNumberString)]; // this is a property like "2"
        // itemData could be undefined if the listblock contains no partial, just markup
        var allData = plutils.mergeData(pattern.allData, itemData !== undefined ? itemData[j] : {});
        allData.link = extend({}, patternlab.data.link);

        // just render with mergedData
        thisBlockHTML = pattern_assembler.renderPattern(thisBlockTemplate, allData);

        // add the rendered HTML to our string
        repeatedBlockHtml = repeatedBlockHtml + thisBlockHTML;
      }

      // replace the block with our generated HTML
      var repeatingBlock = pattern.extendedTemplate.substring(
        pattern.extendedTemplate.indexOf(liMatch), pattern.extendedTemplate.indexOf(end) + end.length);
      pattern.extendedTemplate = pattern.extendedTemplate.replace(repeatingBlock, repeatedBlockHtml);
    }
  }

  return {
    processListItemPartials: function (pattern, patternlab) {
      processListItemPartials(pattern, patternlab);
    },
    items: items
  };
};

module.exports = list_item_hunter;
