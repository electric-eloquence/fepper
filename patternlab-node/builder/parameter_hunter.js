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

		function findparameters(pattern, patternlab){

			//find the {{> template-name(*) }} within patterns
			var matches = pattern.template.match(/{{>([ ]+)?([\w\-\.\/~]+)(\()(.+)(\))([ ]+)?}}/g);
			if(matches !== null){
				//compile this partial immeadiately, essentially consuming it.
				matches.forEach(function(pMatch, index, matches){
					//find the partial's name
					var partialName = pMatch.match(/([\w\-\.\/~]+)/g)[0];

					if(patternlab.config.debug){
						console.log('found patternParameters for ' + partialName);
					}

					//strip out the additional data and eval
					var leftParen = pMatch.indexOf('(');
					var rightParen = pMatch.indexOf(')');
					var paramString =  '({' + pMatch.substring(leftParen + 1, rightParen) + '})';

					//do no evil. there is no good way to do this that I can think of without using a split, which then makes commas and colons special characters and unusable within the pattern params
					var paramData = eval(paramString);

					var partialPattern = pattern_assembler.get_pattern_by_key(partialName, patternlab);

					//in order to only token-replace parameterized tags, we'll switch them to ERB-style tags
					//as per the Mustache docs https://mustache.github.io/mustache.5.html.
					var escapedKey;
					var regex;
					for(var i in paramData){
						if(paramData.hasOwnProperty(i) && (typeof paramData[i] === 'boolean' || typeof paramData[i] === 'number' || typeof paramData[i] === 'string')){
							//escape regex special characters as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
							escapedKey = i.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
							//apply replacement based on allowable characters from lines 78 and 79 of mustache.js
							//of the Mustache for JS project.
							regex = new RegExp('{{([{#\\^\\/&]?\\s*' + escapedKey + '\\s*}?)}}', 'g');
							partialPattern.extendedTemplate = partialPattern.extendedTemplate.replace(regex, '<%$1%>');
						}
					}

					//then set the new delimiter at the beginning of the extended template
					partialPattern.extendedTemplate = '{{=<% %>=}}' + partialPattern.extendedTemplate;

					//render the newly delimited partial
					var renderedPartial = pattern_assembler.renderPattern(partialPattern.extendedTemplate, paramData);

					//unset the delimiter artifact
					renderedPartial = renderedPartial.replace(/{{==}}/g, '');

					//remove the parameter from the partial and replace it with the rendered partial + paramData
					pattern.extendedTemplate = pattern.extendedTemplate.replace(pMatch, renderedPartial);
				});
			}
		}

		return {
			find_parameters: function(pattern, patternlab){
				findparameters(pattern, patternlab);
			}
		};

	};

	module.exports = parameter_hunter;

}());
