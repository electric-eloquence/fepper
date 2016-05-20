(function () {
  'use strict';

  var cheerio = require('cheerio');
  var fs = require('fs');
  var tidy = require('htmltidy2').tidy;
  var request = require('request');

  var htmlObj = require('../lib/html');
  var utils = require('../lib/utils');

  var html2json = require('html2json').html2json;
  var json2html = require('html2json').json2html;

  /**
   * @param {string} str - The text requiring sane newlines.
   * @return {string} A line feed at the end and stripped of carriage returns.
   */
  exports.newlineFormat = function (str) {
    str = str.replace(/\r/g, '') + '\n';

    return str;
  };

  /**
   * @param {array} dataArr - Data array.
   * @return {string} Sanitized HTML.
   */
  exports.dataArrayToJson = function (dataArr) {
    var jsonForData = {html: [{}]};

    for (var i = 0; i < dataArr.length; i++) {
      for (var j in dataArr[i]) {
        if (dataArr[i].hasOwnProperty(j)) {
          jsonForData.html[0][j] = dataArr[i][j];
        }
      }
    }

    return jsonForData;
  };

  /**
   * @param {string} templateDir - Write destination directory.
   * @param {string} fileName - Filename.
   * @param {string} fileHtml - Mustache file's content.
   * @param {string} fileJson - JSON file's content.
   * @param {object} res - response object.
   */
  exports.filesWrite = function (templateDir, fileName, fileHtml, fileJson, res) {
    try {
      fs.writeFileSync(templateDir + '/' + fileName + '.mustache', fileHtml);
      fs.writeFileSync(templateDir + '/' + fileName + '.json', fileJson);

      exports.redirectWithMsg(res, 'success', 'Go+back+to+the+Pattern+Lab+tab+and+refresh+the+browser+to+check+that+your+template+appears+under+the+Scrape+menu.');
      return;
    }
    catch (err) {
      utils.error(err);
    }
  };

  /**
   * Sanitize scraped HTML.
   *
   * @param {string} html - raw HTML.
   * @return {string} Sanitized HTML.
   */
  exports.htmlSanitize = function (html) {
    html = html.replace(/<script(.*?)>/g, '<code$1>');
    html = html.replace(/<\/script(.*?)>/g, '</code$1>');
    html = html.replace(/<textarea(.*?)>/g, '<figure$1>');
    html = html.replace(/<\/textarea(.*?)>/g, '</figure$1>');

    return html;
  };

  /**
   * @param {string} fileName - Filename.
   * @return {boolean} True or false.
   */
  exports.isFilenameValid = function (fileName) {
    return fileName.match(/^[A-Za-z0-9][\w\-\.]*$/) ? true : false;
  };

  exports.jsonRecurse = function (jsonObj, dataArr, recursionInc, index, prevIndex) {
    var obj;
    var underscored;

    for (var i in jsonObj) {
      if (!jsonObj.hasOwnProperty(i)) {
        continue;
      }

      else if (i !== '_' && i !== '$' && typeof jsonObj[i] === 'object') {
        recursionInc++;
        exports.jsonRecurse(jsonObj[i], dataArr, recursionInc, i, index);
      }

      else if (i === '_') {
        for (var j in jsonObj) {
          if (!jsonObj.hasOwnProperty(j)) {
            continue;
          }

          else if (j !== '$') {
            continue;
          }

          underscored = '';
          for (var k in jsonObj[j]) {
            if (!jsonObj[j].hasOwnProperty(k)) {
              continue;
            }

            else if (k === 'class') {
              underscored = jsonObj[j][k].replace(/-/g, '_').replace(/ /g, '_').replace(/[^\w]/g, '') + '_' + recursionInc;
              obj = {};
              obj[underscored] = jsonObj[i];
              dataArr.push(obj);
              break;
            }

            else if (k === 'id') {
              underscored = jsonObj[j][k].replace(/-/g, '_').replace(/ /g, '_').replace(/[^\w]/g, '') + '_' + recursionInc;
              obj = {};
              obj[underscored] = jsonObj[i];
              dataArr.push(obj);
              // Don't break because we would prefer to use classes.
            }
          }
        }

        if (underscored === '') {
          if (typeof index !== 'undefined' && typeof prevIndex !== 'undefined') {
            underscored = prevIndex + '_' + recursionInc;
            obj = {};
            obj[underscored] = jsonObj[i];
            dataArr.push(obj);
            jsonObj[i] = '{{ ' + underscored + ' }}';
          }
        }

        else {
          jsonObj[i] = '{{ ' + underscored + ' }}';
        }
      }
    }
    return jsonObj;
  };



  exports.jsonRecurse2 = function (jsonObj, dataArr) {
    var obj;
    var suffix;
    var suffixInt;
    var underscored = '';

    if (
      jsonObj.child &&
      jsonObj.child[0] &&
      jsonObj.child[0].node === 'text' &&
      typeof jsonObj.child[0].text === 'string' &&
      jsonObj.child[0].text.trim()
    ) {

      if (jsonObj.attr) {
        if (typeof jsonObj.attr.id === 'string') {
          underscored = jsonObj.attr.id;
        }
        else if (typeof jsonObj.attr.class === 'string') {
          underscored = jsonObj.attr.class;
        }
      }
      else if (typeof jsonObj.tag === 'string') {
        underscored = jsonObj.tag;
      }

      if (underscored) {
        underscored = underscored.replace(/-/g, '_').replace(/ /g, '_').replace(/[^\w]/g, '');
        // Add incrementing suffix to dedupe items of the same class or tag.
        for (var i = dataArr.length - 1; i >= 0; i--) {
          // Check dataArr for similarly named items.
          for (var j in dataArr[i]) {
            if (dataArr[i].hasOwnProperty(j)) {
              if (j.indexOf(underscored) === 0) {
                // Slice off the suffix of the last match.
                suffix = j.slice(underscored.length, j.length);
                if (suffix) {
                  // Increment that suffix and append to the new key.
                  suffixInt = parseInt(suffix.slice(1), 10);
                }
                else {
                  suffixInt = 0;
                }
                suffixInt++;
                underscored += '_' + suffixInt;
              }
            }
          }
        }
        obj = {};
        obj[underscored] = jsonObj.child[0].text;
        dataArr.push(obj);
        jsonObj.child[0].text = '{{ ' + underscored + ' }}';
      }
    }
    else if (Array.isArray(jsonObj.child)) {
      for (var i = 0; i < jsonObj.child.length; i++) {
        exports.jsonRecurse2(jsonObj.child[i], dataArr);
      }
    }
  };



  /**
   * @param {object} jsonForHtml - JSON for conversion to Mustache syntax.
   * @param {function} resolve - a Promise resolve function.
   * @return {string} XHTML.
   */
  exports.jsonToMustache = function (jsonForHtml, resolve) {
    // Create an array which can be passed by reference and mutated by async
    // functions.
    var html = json2html(jsonForHtml);

    // Clean up.
    html = html.replace(/^\s*\n/g, '');
    tidy(html, {indent: true, showBodyOnly: true}, function (err, htmlTidied) {
      resolve(htmlTidied);
    });
  };

  exports.outputHtml = function (dataArr1, jsonForData, htmlObj, html) {
    // Convert dataArr1 to JSON and stringify for output.
    var jsonForData = exports.dataArrayToJson(dataArr1);
    var dataStr = JSON.stringify(jsonForData, null, 2);
    var  output = '';

    output += htmlObj.head;
    output += '<section>\n';
    output += htmlObj.scraperTitle;
    output += htmlObj.reviewerPrefix;
    // HTML entities.
    output += $('<div/>').text(targetHtml).html().replace(/\n/g, '<br>');
    output += htmlObj.reviewerSuffix;
    output += htmlObj.importerPrefix;
    output += html;
    output += htmlObj.json;
    output += dataStr;
    output += htmlObj.importerSuffix;
    output += htmlObj.landingBody;
    output += '</section>';
    output += htmlObj.foot;
    output = output.replace('{{ title }}', 'Fepper HTML Scraper');
    output = output.replace('{{ class }}', 'scraper');
    output = output.replace('{{ attributes }}', '');
    output = output.replace('{{ url }}', req.body.url);
    output = output.replace('{{ target }}', req.body.target);
    res.end(output);
  }

  exports.redirectWithMsg = function (res, type, msg, target, url) {
    if (res) {
      target = typeof target === 'string' ? target : '';
      url = typeof url === 'string' ? url : '';
      res.writeHead(303, {Location: 'html-scraper?' + type + '=' + msg + '&target=' + target + '&url=' + url});
      res.end();
    }
  };

  exports.targetHtmlGet = function ($targetEl, targetIndex, $) {
    // Iterate through the collection of selected elements. If an index
    // is specified, skip until that index is iterated upon.
    var $el;
    var innerHtml;
    var j = 0;
    var outerHtml;
    var targetFirst;
    var targetHtml = '';

    $targetEl.each(function (i, el) {
      if (targetIndex === '' || parseInt(targetIndex, 10) === i) {
        $el = $(el);
        // Cheerio hack for getting outerHTML.
        innerHtml = $el.html();
        outerHtml = $el.html(innerHtml) + '\n';
        targetHtml += outerHtml;
        if (j === 0) {
          targetFirst = outerHtml;
        }
        j++;
      }
    });

    return {all: targetHtml, first: targetFirst};
  };

  exports.targetValidate = function (target, res, req) {
    // Split at array index, if any.
    var targetSplit = target.split('[', 2);
    targetSplit[1] = targetSplit[1] ? targetSplit[1] : '';

    // Validate that targetSplit[0] is a css selector.
    if (!targetSplit[0].match(/^(#|\.)?[a-z][\w#\-\.]*$/i)) {
      exports.redirectWithMsg(res, 'error', 'Incorrect+submission.', req.body.target, req.body.url);
      return [];
    }

    // Remove closing bracket from targetSplit[1] and validate it is an integer.
    targetSplit[1] = targetSplit[1].substr(0, targetSplit[1].length - 1);
    if (!targetSplit[1].match(/\d*/)) {
      exports.redirectWithMsg(res, 'error', 'Incorrect+submission.', req.body.target, req.body.url);
      return [];
    }

    return targetSplit;
  };

  exports.htmlToJsonAndArray = function (targetHtml) {
    var jsonForHtml = html2json(targetHtml);
    var dataArr = [];

    exports.jsonRecurse2(jsonForHtml, dataArr);
    return {json: jsonForHtml, array: dataArr};
  }

  exports.main = function (req, res) {
    var $;
    var dataArr1;
    var dataObj;
    var dataStr;
    var fileHtml;
    var fileJson;
    var fileName;
    var html = '';
    var jsonForData;
    var jsonForHtml;
    var jsonForXhtml;
    var output;
    var promise;
    var target;
    var targetBase;
    var $targetEl;
    var targetFirst;
    var targetHtml;
    var targetHtmlObj;
    var targetIndex;
    var targetSplit;
    var targetXhtml;
    var templateDir;
    var xhtml = '';

    // HTML scraper action on submission of URL.
    if (typeof req.body.url === 'string' && req.body.url.trim() && typeof req.body.target === 'string') {
      try {
        request(req.body.url, function (error, response, body) {
          if (error || response.statusCode !== 200) {
            exports.redirectWithMsg(res, 'error', 'Not+getting+a+valid+response+from+that+URL.', req.body.target, req.body.url);
            return;
          }

          $ = cheerio.load(body);
          target = req.body.target.trim();
          targetSplit = exports.targetValidate(target, res, req);
          targetBase = targetSplit[0];
          targetIndex = targetSplit[1];
          targetHtml = '';
          $targetEl = $(targetBase);

console.info($targetEl);
          if ($targetEl.length) {
            targetHtmlObj = exports.targetHtmlGet($targetEl, targetIndex, $);

            // Sanitize scraped HTML.
            targetHtml = exports.htmlSanitize(targetHtmlObj.all);
            targetFirst = exports.htmlSanitize(targetHtmlObj.first);

            // Convert HTML to XHTML for conversion to full JSON data object.
            targetXhtml = exports.htmlToXhtml(targetHtml);

            // Get array from XHTML.
            dataArr1 = exports.xhtmlToJsonAndArray(targetXhtml).array;

            // Delete html tags.
//            targetHtml = targetHtml.replace('<html>', '').replace('</html>', '');

            // Convert HTML to XHTML for Mustache template.
//            targetXhtml = exports.htmlToXhtml(targetFirst);

            // Get JSON and array from XHTML.
console.info($targetEl);
console.info(targetHtmlObj);
console.info(targetHtml);
            dataObj = exports.htmlToJsonAndArray(targetHtml);

            // Get dataArr2 array. We can't use dataArr1 because we need it
            // untouched so we can build jsonForData.
            dataArr1 = dataObj.array;

            // Build XHTML with mustache tags.
            jsonForHtml = dataObj.json;
console.info(utils.i(jsonForHtml));
            promise = new Promise(function (resolve, reject) {
              exports.jsonToMustache(jsonForHtml, resolve);
            });
            promise.then(function (value) {
              exports.outputHtml(value);
            });
          }
          else {
            exports.outputHtml(targetHtml);
          }

        });
      }
      catch (err) {
        utils.error(err);
      }
    }

    // HTML importer action on submission of filename.
    else if (typeof req.body.filename === 'string' && req.body.filename !== '') {
      // Limit filename characters.
      if (!exports.isFilenameValid(req.body.filename)) {
        exports.redirectWithMsg(res, 'error', 'Please+enter+a+valid+filename!.', req.body.target, req.body.url);
        return;
      }
      else {
        fileName = req.body.filename;
      }

      templateDir = 'patternlab-node/source/_patterns/98-scrape';
      fileHtml = exports.newlineFormat(req.body.html);
      fileJson = exports.newlineFormat(req.body.json);
      exports.filesWrite(templateDir, fileName, fileHtml, fileJson, res);
    }

    // If no form variables sent, redirect back with GET.
    else {
      try {
        exports.redirectWithMsg(res, 'error', 'Incorrect+submission.', req.body.target, req.body.url);
        return;
      }
      catch (err) {
        utils.error(err);
      }
    }
  };
})();
