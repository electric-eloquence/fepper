(function () {
  'use strict';

  var cheerio = require('cheerio');
  var fs = require('fs');
  var request = require('request');
  var xml2js = require('xml2js');
  var xmldom = require('xmldom');

  var builder = new xml2js.Builder();
  var domParser = new xmldom.DOMParser();
  var htmlObj = require('../lib/html');
  var utils = require('../lib/utils');
  var xmlSerializer = new xmldom.XMLSerializer();

  /**
   * @param {string} str - The text requiring sane newlines.
   * @return {string} A line feed at the end and stripped of carriage returns.
   */
  exports.newlineFormat = function (str) {
    str = str.replace(/\r/g, '') + '\n';

    return str;
  };

  /**
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
   * Convert HTML to XHTML for conversion to full JSON data object.
   *
   * @return {string} XHTML.
   */
  exports.htmlToXhtml = function (targetHtml) {
    var targetParsed = domParser.parseFromString(targetHtml, 'text/html');
    var targetXhtml = xmlSerializer.serializeToString(targetParsed);

    return targetXhtml;
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

  /**
   * @param {Object} jsonForXhtml - JSON for conversion to Mustache syntax.
   * @return {string} XHTML.
   */
  exports.jsonToMustache = function (jsonForXhtml) {
    var xhtml = builder.buildObject(jsonForXhtml);
    // Remove XML declaration.
    xhtml = xhtml.replace(/<\?xml[^>]*\?>/g, '');
    // Replace html tags with Mustache tags.
    xhtml = xhtml.replace('<html>', '{{# html }}').replace('</html>', '{{/ html }}');
    // Clean up.
    xhtml = xhtml.replace(/^\s*\n/g, '');

    return xhtml;
  };

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

  /**
   * Get JSON and array from XHTML.
   *
   * @param {string} targetXhtml - Well formed XHTML.
   * @return {Object} Prop 1: json, Prop2: array.
   */
  exports.xhtmlToJsonAndArray = function (targetXhtml) {
    var dataArr;
    var jsonForXhtml;

    // Convert to JSON.
    xml2js.parseString(targetXhtml, function (err, res) {
      if (err) {
        utils.error(err);
        return {};
      }

      // jsonRecurse builds dataArr.
      dataArr = [];
      jsonForXhtml = exports.jsonRecurse(res, dataArr, 0);
    });

    return {json: jsonForXhtml, array: dataArr};
  };

  exports.main = function (req, res) {
    var $;
    var dataArr1;
    var dataObj;
    var dataStr;
    var fileHtml;
    var fileJson;
    var fileName;
    var jsonForData;
    var jsonForXhtml;
    var output;
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

          if ($targetEl.length) {
            targetHtmlObj = exports.targetHtmlGet($targetEl, targetIndex, $);

            // Sanitize scraped HTML.
            targetHtml = '<html>' + exports.htmlSanitize(targetHtmlObj.all) + '</html>';
            targetFirst = '<html>' + exports.htmlSanitize(targetHtmlObj.first) + '</html>';

            // Convert HTML to XHTML for conversion to full JSON data object.
            targetXhtml = exports.htmlToXhtml(targetHtml);

            // Get array from XHTML.
            dataArr1 = exports.xhtmlToJsonAndArray(targetXhtml).array;

            // Delete html tags.
            targetHtml = targetHtml.replace('<html>', '').replace('</html>', '');

            // Convert HTML to XHTML for Mustache template.
            targetXhtml = exports.htmlToXhtml(targetFirst);

            // Get JSON and array from XHTML.
            dataObj = exports.xhtmlToJsonAndArray(targetXhtml);

            // Get dataArr2 array. We can't use dataArr1 because we need it
            // untouched so we can build jsonForData.
            dataArr1 = dataObj.array;

            // Build XHTML with mustache tags.
            jsonForXhtml = dataObj.json;
            xhtml = exports.jsonToMustache(jsonForXhtml);
          }

          // Convert dataArr1 to JSON and stringify for output.
          jsonForData = exports.dataArrayToJson(dataArr1);
          dataStr = JSON.stringify(jsonForData, null, 2);

          output = '';
          output += htmlObj.head;
          output += '<section>\n';
          output += htmlObj.scraperTitle;
          output += htmlObj.reviewerPrefix;
          // HTML entities.
          output += $('<div/>').text(targetHtml).html().replace(/\n/g, '<br>');
          output += htmlObj.reviewerSuffix;
          output += htmlObj.importerPrefix;
          output += xhtml;
          output += htmlObj.json;
          output += dataStr;
          output += htmlObj.importerSuffix;
          output += htmlObj.landingBody;
          output += '</section>';
          output += htmlObj.foot;
          output = output.replace('{{ title }}', 'Fepper HTML Scraper');
          output = output.replace('{{ class }}', 'scraper');
          output = output.replace('{{ url }}', req.body.url);
          output = output.replace('{{ target }}', req.body.target);
          res.end(output);
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
