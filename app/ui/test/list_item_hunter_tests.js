/* eslint-disable max-len */
'use strict';

var fs = require('fs-extra');

var lih = require('../core/lib/list_item_hunter');
var Pattern = require('../core/lib/object_factory').Pattern;
var pa = require('../core/lib/pattern_assembler');
var patternEngines = require('../core/lib/pattern_engines');
var plMain = require('../core/lib/patternlab');

var dummyPattern = Pattern.createEmpty();
var engine = patternEngines.getEngineForPattern(dummyPattern);
var list_item_hunter = new lih();
var pattern_assembler = new pa();

var patternlab = fs.readJsonSync('./test/files/patternlab.json');
var patternsDir = './test/files/_patterns';

// dummy data
patternlab.listitems = require('./files/_data/listitems.json');

// build listitems
pattern_assembler.buildListItems(patternlab);

// iteratively populate the patternlab object for use through entire test
plMain.processAllPatternsIterative(pattern_assembler, patternsDir, patternlab);

// push list item keywords into dataKeys property
patternlab.dataKeys = ['styleModifier'].concat(pattern_assembler.getDataKeys(patternlab.data));

for (var i = 0; i < list_item_hunter.items.length; i++) {
  patternlab.dataKeys.push('listItems.' + list_item_hunter.items[i]);
  patternlab.dataKeys.push('listitems.' + list_item_hunter.items[i]);
}

// set up commonly used test patterns
// we don't want to run processPatternRecursive because it writes to the file system which is unnecessary for testing
// so we run its relevant subroutines
var atomPattern = pattern_assembler.getPartial('test-styled-atom', patternlab);
var listitem1Pattern = pattern_assembler.getPartial('test-listitem', patternlab);
var simplePattern = pattern_assembler.getPartial('test1-simple', patternlab);
var listitems2Pattern = pattern_assembler.getPartial('test1-listitems', patternlab);
var listitemsLocalPattern = pattern_assembler.getPartial('test1-listitems-local', patternlab);
var listitemsMixedPattern = pattern_assembler.getPartial('test1-listitems-mixed', patternlab);
var listitemsNestedPattern = pattern_assembler.getPartial('test1-listitems-nested', patternlab);

var atomPartial = pattern_assembler.preRenderPartial(atomPattern, patternlab).tmpPartial;
var listitem1Partial = pattern_assembler.preRenderPartial(listitem1Pattern, patternlab).tmpPartial;
var simplePartial = pattern_assembler.preRenderPartial(simplePattern, patternlab).tmpPartial;
var listitems2Partial = pattern_assembler.preRenderPartial(listitems2Pattern, patternlab).tmpPartial;
var listitemsLocalPartial = pattern_assembler.preRenderPartial(listitemsLocalPattern, patternlab).tmpPartial;
var listitemsMixedPartial = pattern_assembler.preRenderPartial(listitemsMixedPattern, patternlab).tmpPartial;
var listitemsNestedPartial = pattern_assembler.preRenderPartial(listitemsNestedPattern, patternlab).tmpPartial;

pattern_assembler.renderPartials(atomPartial, atomPattern, patternlab);
pattern_assembler.renderPartials(listitem1Partial, listitem1Pattern, patternlab);
pattern_assembler.renderPartials(simplePartial, simplePattern, patternlab);
pattern_assembler.renderPartials(listitems2Partial, listitems2Pattern, patternlab);
pattern_assembler.renderPartials(listitemsLocalPartial, listitemsLocalPattern, patternlab);
pattern_assembler.renderPartials(listitemsMixedPartial, listitemsMixedPattern, patternlab);
pattern_assembler.renderPartials(listitemsNestedPartial, listitemsNestedPattern, patternlab);

atomPattern.extendedTemplate = pattern_assembler.extendPartials(atomPartial, engine);
listitem1Pattern.extendedTemplate = pattern_assembler.extendPartials(listitem1Partial, engine);
simplePattern.extendedTemplate = pattern_assembler.extendPartials(simplePartial, engine);
listitems2Pattern.extendedTemplate = pattern_assembler.extendPartials(listitems2Partial, engine);
listitemsLocalPattern.extendedTemplate = pattern_assembler.extendPartials(listitemsLocalPartial, engine);
listitemsMixedPattern.extendedTemplate = pattern_assembler.extendPartials(listitemsMixedPartial, engine);
listitemsNestedPattern.extendedTemplate = pattern_assembler.extendPartials(listitemsNestedPartial, engine);

list_item_hunter.processListItemPartials(atomPattern, patternlab);
list_item_hunter.processListItemPartials(listitem1Pattern, patternlab);
list_item_hunter.processListItemPartials(simplePattern, patternlab);
list_item_hunter.processListItemPartials(listitems2Pattern, patternlab);
list_item_hunter.processListItemPartials(listitemsLocalPattern, patternlab);
list_item_hunter.processListItemPartials(listitemsMixedPattern, patternlab);
list_item_hunter.processListItemPartials(listitemsNestedPattern, patternlab);

var listitem1Rendered = pattern_assembler.renderPattern(listitem1Pattern, listitem1Pattern.allData);
var listitems2Rendered = pattern_assembler.renderPattern(listitems2Pattern, listitems2Pattern.allData);
var listitemsLocalRendered = pattern_assembler.renderPattern(listitemsLocalPattern, listitemsLocalPattern.allData);
var listitemsMixedRendered = pattern_assembler.renderPattern(listitemsMixedPattern, listitemsMixedPattern.allData);
var listitemsNestedRendered = pattern_assembler.renderPattern(listitemsNestedPattern, listitemsNestedPattern.allData);

exports.list_item_hunter = {
  'process_list_item_partials finds and outputs basic repeating blocks': function (test) {
    test.expect(1);

    // assert
    test.equals(listitem1Rendered, '<span class="test_base ">  Fizzle crazy tortor. Sed rizzle. Ass pimpin&#39; dolor dapibizzle turpis tempizzle fo shizzle my nizzle. Maurizzle pellentesque its fo rizzle izzle turpis. Get down get down we gonna chung nizzle. Shizzlin dizzle eleifend rhoncizzle break it down. In yo ghetto platea dictumst. Bling bling dapibizzle. Curabitur break yo neck, yall fo, pretizzle eu, go to hizzle dope, own yo&#39; vitae, nunc. Bizzle suscipizzle. Ass semper velit sizzle fo. </span>');

    test.done();
  },

  'process_list_item_partials finds partials and outputs repeated renders': function (test) {
    test.expect(1);

    // assert
    test.equals(listitems2Rendered, 'Nullizzle shizznit velizzle, hizzle, suscipit own yo&#39;, gravida vizzle, arcu. Nullizzle shizznit velizzle, hizzle, suscipit own yo&#39;, gravida vizzle, arcu. ');

    test.done();
  },

  'process_list_item_partials overwrites global listItem property if that property is in local .listitem.json': function
  (test) {
    test.expect(1);

    // assert
    test.equals(listitemsLocalRendered, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ');

    test.done();
  },

  'process_list_item_partials recursively processes nested listItems': function (test) {
    test.expect(1);

    // assert
    test.equals(listitemsMixedRendered, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. listitemMessageLorem ipsum dolor sit amet, consectetur adipiscing elit. listitemMessage');

    test.done();
  },

  'process_list_item_partials uses local listItem property if that property is not set globally' : function (test) {
    test.expect(1);

    // assert
    test.equals(listitemsNestedRendered, 'Nullizzle shizznit velizzle, hizzle, suscipit own yo&#39;, gravida vizzle, arcu. Nullizzle shizznit velizzle, hizzle, suscipit own yo&#39;, gravida vizzle, arcu. ');

    test.done();
  }
};
