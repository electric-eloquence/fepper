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

	var parameter_hunter = function(){

		var extend = require('util')._extend,
		pa = require('./pattern_assembler'),
		mustache = require('mustache'),
		pattern_assembler = new pa();

	var paramDataAll;

		function findparameters(pattern, patternlab, startFile){
if (
startFile === './source/_patterns/04-pages/02-articles/00-article.mustache'
// && (
//pattern.fileName === 'region' ||
//pattern.fileName === '00-header'
//)
) {
console.log('#### BEGIN FUNCTION ####: ' + pattern.fileName);
}
//console.log('pattern.fileName: ' + pattern.fileName);
//console.log(startFile);

          var startPattern = pattern_assembler.get_pattern_by_key(startFile, patternlab);
          if (!startPattern) {
            return;
          }
			var parameterizedTemplate = pattern.parameterizedTemplate;


      //look for a json file for this template
      var jsonFilename;
      var jsonFileData;
      try {
        pattern.parameterizedData = startPattern.jsonFileData;
        
        if(patternlab.config.debug){
          console.log('found pattern-specific data.json for ' + pattern.key);
        }
      }
      catch(e) {
      }
			//find any partial within pattern

if (typeof parameterizedTemplate === 'undefined') {
//console.log(pattern);
  return '';
}

			var foundPatternPartials = pattern_assembler.find_pattern_partials_extended(parameterizedTemplate);
			if(!foundPatternPartials){
				return parameterizedTemplate;
			}

			//find the {{> template-name(*) }} within patterns
			var parameterizedPartial;
			var partialName;
			var partialPattern;
			var partialTemplateTmp;
var returnVar;
			if(foundPatternPartials === null){
			} else{
if (
startFile === './source/_patterns/04-pages/02-articles/00-article.mustache'
// && (
//pattern.fileName === 'region' ||
//pattern.fileName === '00-header'
//)
) {
console.log('#### MATCHES ####: ' + pattern.fileName);
}
// First reset parameterizedTemplate for all found partials.
//foundPatternPartials = pattern_assembler.find_pattern_partials_extended(pattern.parameterizedTemplate);
        for(var i = 0; i < foundPatternPartials.length; i++){
//@TODO:create getKeyFromTag function.
          var partialKey = foundPatternPartials[i].replace(/{{>([ ])?([\w\-\.\/~]+)(?:\:[A-Za-z0-9-]+)?(?:(| )\(.*)?([ ])?}}/g, '$2');
          //identify which pattern this partial corresponds to
          partialPattern = pattern_assembler.get_pattern_by_key(partialKey, patternlab);
//          partialPattern.parameterizedTemplate = partialPattern.template;
        }
          
      var allData =  JSON.parse(JSON.stringify(patternlab.data));

				//compile this partial immeadiately, essentially consuming it.
				foundPatternPartials.forEach(function(pMatch, index, foundPatternPartials){
					if(parameterizedTemplate.indexOf(pMatch) === -1){
						return;
					}

					//find the partial's name
					partialName = pMatch.match(/([\w\-\.\/~]+)/g)[0];

					if(patternlab.config.debug){
						console.log('found patternParameters for ' + partialName);
					}

			parameterizedPartial = pMatch.match(/{{>([ ]+)?([\w\-\.\/~]+)(\()(.+)(\))([ ]+)?}}/g);
          partialPattern = pattern_assembler.get_pattern_by_key(partialName, patternlab);
                    if (!parameterizedPartial) {
					partialTemplateTmp = findparameters(partialPattern, patternlab, startFile);
          pattern.parameterizedTemplate = pattern.parameterizedTemplate.replace(pMatch, partialTemplateTmp);
parameterizedTemplate = pattern.parameterizedTemplate;
                    } else{ 
          partialPattern.parameterizedTemplate = partialPattern.template;
					//strip out the additional data and eval
					var leftParen = pMatch.indexOf('(');
					var rightParen = pMatch.indexOf(')');
					var paramString =  '({' + pMatch.substring(leftParen + 1, rightParen) + '})';

					//do no evil. there is no good way to do this that I can think of without using a split, which then makes commas and colons special characters and unusable within the pattern params
					var paramData = eval(paramString);
if (startFile === './source/_patterns/04-pages/02-articles/00-article.mustache' && (
pattern.fileName === '00-article' ||
pattern.fileName === 'page'
)
) {
console.log('#### CHECKING FOR PARAM DATA ####: ');
console.log(paramData);
}
                    pattern.parameterizedData = paramData;
					partialTemplateTmp = partialPattern.parameterizedTemplate;

					//in order to only token-replace parameterized tags, switch them to ERB-style tags
					//as per the Mustache docs https://mustache.github.io/mustache.5.html.
					var escapedKey;
					var regex;
					for(var i in paramData){
						if(paramData.hasOwnProperty(i) && (typeof paramData[i] === 'boolean' || typeof paramData[i] === 'number' || typeof paramData[i] === 'string')){
							//escape regex special characters as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
							escapedKey = i.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
							//apply replacement based on allowable characters from lines 78 and 79 of mustache.js
							//of the Mustache for JS project.
							regex = new RegExp('{{([{#\\^\\/&]?\\s*' + escapedKey + '\\s*}?)}}', 'g');
							partialTemplateTmp = partialTemplateTmp.replace(regex, '<%$1%>');
						}
					}

					//then set the new delimiter at the beginning of the extended template
					partialTemplateTmp = '{{=<% %>=}}' + partialTemplateTmp;
//      pattern.parameterizedData = pattern_assembler.merge_data(allData, pattern.parameterizedData);

					//render the newly delimited partial
if(typeof partialTemplateTmp === 'undefined') {
//console.log(partialTemplateTmp);
}
					var renderedPartial = pattern_assembler.renderPattern(partialTemplateTmp, paramData);

if (startFile === './source/_patterns/04-pages/02-articles/00-article.mustache') {
if (
pattern.fileName === '00-article' ||
pattern.fileName === 'page'
) {
console.log('#### CHECKING FOR PARTIALS ####: parameterizedPartial');
console.log(foundPatternPartials);
console.log(renderedPartial);
//console.log(partialTemplateTmp);
}
}
					//reset back to the default delimiter
//					partialTemplateTmp = partialTemplateTmp.replace(/{{=<% %>=}}/g, '');

							//escape regex special characters as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
//							var escapedParamPartial = pMatch.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
//							regex = new RegExp(escapedParamPartial, 'g');
					//remove the parameter from the partial and replace it with the rendered partial + paramData
					partialPattern.parameterizedTemplate = renderedPartial;
					partialTemplateTmp = findparameters(partialPattern, patternlab, startFile);
          pattern.parameterizedTemplate = pattern.parameterizedTemplate.replace(pMatch, partialTemplateTmp);
parameterizedTemplate = pattern.parameterizedTemplate;
                    }
				});
			}
if (
startFile === './source/_patterns/04-pages/02-articles/00-article.mustache' && (
pattern.fileName === '00-article'
)) {
console.log('#### AFTER RECURSION ####: ');
//console.log(foundPatternPartials[i]);
//console.log(partialTemplateTmp);
console.log(parameterizedTemplate);
}
//foundPatternPartials = pattern.parameterizedTemplate.match(/{{>([ ])?([\w\-\.\/~]+)([ ])?}}/g);
			foundPatternPartials = pattern_assembler.find_pattern_partials_extended(pattern.parameterizedTemplate);
			return parameterizedTemplate;
		}

		return {
			find_parameters: function(pattern, patternlab, params){
				return findparameters(pattern, patternlab, params);
			}
		};

	};

	module.exports = parameter_hunter;

}());
