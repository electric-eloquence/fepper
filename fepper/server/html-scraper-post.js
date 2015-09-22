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
  var parseString = xml2js.parseString;
  var xmlSerializer = new xmldom.XMLSerializer();

  exports.redirectWithMsg = function (res, type, msg, target, url) {
    target = typeof target === 'string' ? target : '';
    url = typeof url === 'string' ? url : '';
    res.writeHead(303, { Location: 'html-scraper?' + type + '=' +  msg + '&target=' + target + '&url=' + url });
    res.end();
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

  exports.targetValidate(target) {
    // Split at array index, if any.
    var targetSplit = target.split('[', 2);
    targetSplit[1] = targetSplit[1] ? targetSplit[1] : '';

    // Validate that targetSplit[0] is a css selector.
    if (!targetSplit[0].match(/^(#|\.)[\w#\-\.]+$/)) {
      exports.redirectWithMsg(res, 'error', 'Incorrect+submission.', req.body.target, req.body.url);
      return false;
    }

    // Remove closing bracket from targetSplit[1] and validate it is an integer.
    targetSplit[1] = targetSplit[1].substr(0, targetSplit[1].length - 1);
    if (!targetSplit[1].match(/\d+/)) {
      exports.redirectWithMsg(res, 'error', 'Incorrect+submission.', req.body.target, req.body.url);
      return false;
    }

    return targetSplit;
  };

  exports.main = function (req, res) {
    var $;
    var dataArr1;
    var dataArr2;
    var dataStr;
    var $el;
    var fileHtml;
    var fileJson;
    var fileName;
    var i;
    var j;
    var jsonForData;
    var jsonForXhtml;
    var output;
    var target;
    var targetBase;
    var $targetEl;
    var targetFirst;
    var targetHtml;
    var targetIndex;
    var targetParsed;
    var targetSplit;
    var targetXhtml;
    var templateDir;
    var xhtml;

    // HTML scraper action on submission of URL.
    if (typeof req.body.url === 'string' && req.body.url !== '' && typeof req.body.target === 'string') {
      try {
        request(req.body.url, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            $ = cheerio.load(body);
            target = req.body.target.trim();
            targetSplit = exports.targetValidate(target);
            targetBase = targetSplit[0]
            targetIndex = targetSplit[1]
            targetHtml = '';
            $targetEl = $(targetBase);
            if ($targetEl.length) {
              // Iterate through the collection of selected elements. If an index
              // is specified, skip until that index is iterated upon.
              j = 0;
              $targetEl.each(function (i, el) {
                if (targetIndex === ''  ||  parseInt(targetIndex) === i) {
                  $el = $(el);
                  // Cheerio hack for getting outerHTML.
                  var innerHtml = $el.html();
                  var outerHtml = $el.html(innerHtml) + '\n';
                  targetHtml += outerHtml;
                  if (j === 0) {
                    targetFirst = outerHtml;
                  }
                  j++;
                }
              });

              // Sanitize scraped HTML.
              targetHtml = targetHtml.replace(/<script(.*?)>/g, '<code$1>');
              targetHtml = targetHtml.replace(/<\/script(.*?)>/g, '</code$1>');
              targetHtml = targetHtml.replace(/<textarea(.*?)>/g, '<figure$1>');
              targetHtml = targetHtml.replace(/<\/textarea(.*?)>/g, '</figure$1>');
              targetHtml = '<html>' + targetHtml + '</html>';
              targetFirst = targetFirst.replace(/<script(.*?)>/g, '<code$1>');
              targetFirst = targetFirst.replace(/<\/script(.*?)>/g, '</code$1>');
              targetFirst = targetFirst.replace(/<textarea(.*?)>/g, '<figure$1>');
              targetFirst = targetFirst.replace(/<\/textarea(.*?)>/g, '</figure$1>');
              targetFirst = '<html>' + targetFirst + '</html>';

              // Convert HTML to XHTML for conversion to full JSON data object.
              targetParsed = domParser.parseFromString(targetHtml, 'text/html');
              targetXhtml = xmlSerializer.serializeToString(targetParsed);

              // Convert to JSON.
              parseString(targetXhtml, function (err, res) {
                if (err) {
                  utils.error(err);
                }
                else {
                  // jsonRecurse builds dataArr1 object.
                  dataArr1 = [];
                  jsonForXhtml = exports.jsonRecurse(res, dataArr1, 0);
                }
              });

              // Delete html tags.
              targetHtml = targetHtml.replace('<html>', '').replace('</html>', '');

              // Convert HTML to XHTML for Mustache template.
              targetParsed = domParser.parseFromString(targetFirst, 'text/html');
              targetXhtml = xmlSerializer.serializeToString(targetParsed);

              // Convert to JSON.
              parseString(targetXhtml, function (err, res) {
                if (err) {
                  utils.error(err);
                }
                else {
                  // jsonRecurse builds dataArr2 array. We can't use dataArr1
                  // because we need it untouched so we can build jsonForData.
                  // So we instead, we pass dataArr2.
                  dataArr2 = [];
                  jsonForXhtml = exports.jsonRecurse(res, dataArr2, 0);
                  // Build XHTML with mustache tags.
                  xhtml = builder.buildObject(jsonForXhtml);
                  // Remove XML declaration.
                  xhtml = xhtml.replace(/<\?xml[^>]*\?>/g, '');
                  // Replace html tags with Mustache tags.
                  xhtml = xhtml.replace('<html>', '{{# html }}').replace('</html>', '{{/ html }}');
                  // Clean up.
                  xhtml = xhtml.replace(/^\s*\n/g, '');
                }
              });
            }

            jsonForData = {html:[{}]};
            for (i = 0; i < dataArr1.length; i++) {
              for (j in dataArr1[i]) {
                if (dataArr1[i].hasOwnProperty(j)) {
                  jsonForData.html[0][j] = dataArr1[i][j];
                }
              }
            }
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
          }
          else {
            exports.redirectWithMsg(res, 'error', 'Not+getting+a+valid+response+from+that+URL.', req.body.target, req.body.url);
            return false;
          }
        });
      }
      catch (err) {
        utils.error(err);
      }
    }

    // HTML importer action on submission of filename.
    else if (typeof req.body.filename === 'string'  &&  req.body.filename !== '') {
      templateDir = 'patternlab-node/source/_patterns/05-scrape';
      fileHtml = req.body.html.replace(/\r/g, '') + '\n';
      fileJson = req.body.json.replace(/\r/g, '') + '\n';

       // Limit filenames to sane characters
      fileName = req.body.filename.replace(/[^\w.-]/g, '');
      // Don't allow periods at beginning of filenames
      fileName = fileName.replace(/^\.+/g, '');
      // Don't allow hyphens at beginning of filenames
      fileName = fileName.replace(/^-+/g, '');
      if (fileName !== '') {
        try {
          fs.writeFile(templateDir + '/' + fileName + '.mustache', fileHtml, function () {
            fs.writeFile(templateDir + '/' + fileName + '.json', fileJson, function () {
              exports.redirectWithMsg(res, 'success', 'Go+back+to+the+Pattern+Lab+tab+and+refresh+the+browser+to+check+that+your+template+appears+under+the+Scrape+menu.');
              return false;
            });
          });
        }
        catch (err) {
          utils.error(err);
        }
      }
    }

    // If no form variables sent, redirect back with GET.
    else {
      try {
        exports.redirectWithMsg(res, 'error', 'Incorrect+submission.', req.body.target, req.body.url);
        return false;
      }
      catch (err) {
        utils.error(err);
      }
    }
  };
})();
