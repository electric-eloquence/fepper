'use strict';

const beautify = require('js-beautify').html;
const fs = require('fs');
const he = require('he');
const html2json = require('html2json').html2json;
const json2html = require('html2json').json2html;
const request = require('request');

const utils = require('../lib/utils');
const conf = global.conf;

var req;
var res;

class HtmlObj {
  constructor() {
    this.node = 'root';
    this.child = [];
  }
}

class JsonForData {
  constructor() {
    this.html = [{}];
  }
}

/**
 * @param {string} strParam - The text requiring sane newlines.
 * @return {string} A line feed at the end and stripped of carriage returns.
 */
exports.newlineFormat = function (strParam) {
  var str = strParam.replace(/\r/g, '') + '\n';

  return str;
};

/**
 * @param {array} dataArr - Data array.
 * @return {string} Sanitized HTML.
 */
exports.dataArrayToJson = function (dataArr) {
  var jsonForData = new JsonForData();

  for (let i = 0; i < dataArr.length; i++) {
    for (let j in dataArr[i]) {
      if (dataArr[i].hasOwnProperty(j)) {
        jsonForData.html[0][j] = dataArr[i][j];
      }
    }
  }

  return jsonForData;
};

/**
 * @param {string} target - CSS selector plus optional array index.
 * @return {object} An object storing properties of the selector.
 */
exports.elementParse = function (target) {
  var selectorName;
  var selectorType;
  var targetSplit = exports.targetValidate(target);

  switch (targetSplit[0][0]) {
    case '#':
      selectorName = targetSplit[0].slice(1);
      selectorType = 'id';
      break;
    case '.':
      selectorName = targetSplit[0].slice(1);
      selectorType = 'class';
      break;
    default:
      selectorName = targetSplit[0];
      selectorType = 'tag';
  }

  return {name: selectorName, type: selectorType, index: targetSplit[1]};
};

/**
 * Recurse through the object returned by html2json to find the selected element(s).
 *
 * @param {string|object} selectorParam - At level 0, a CSS selector. At deeper levels, the selector object.
 * @param {string} html2jsonObj - The object returned by html2json.
 * @param {string} persistentObjParam - A mutating object presisting to return results. Not submitted at level 0.
 * @param {string} levelParam - The level of recursion. Not submitted at level 0.
 * @return {object} An html2json object containing the matched elements. Only returns at level 0.
 */
exports.elementSelect = function (selectorParam, html2jsonObj, persistentObjParam, levelParam) {
  // Validate 1st param.
  // Validate 2nd param.
  if (!html2jsonObj || html2jsonObj.constructor !== Object || !Array.isArray(html2jsonObj.child)) {
    return null;
  }

  var selectorObj;
  var persistentObj = persistentObjParam || new HtmlObj();
  var level = levelParam || 0;

  if (typeof selectorParam === 'string') {
    selectorObj = exports.elementParse(selectorParam);
  }
  else if (selectorParam && selectorParam.constructor === Object) {
    selectorObj = selectorParam;
  }
  else {
    return null;
  }

  var selectorName = selectorObj.name;
  var selectorType = selectorObj.type;
  var selectorIndex = selectorObj.index;
  persistentObj.index = selectorIndex;

  for (let i = 0; i < html2jsonObj.child.length; i++) {
    let child = html2jsonObj.child[i];

    if (!child || child.constructor !== Object) {
      continue;
    }

    if (child.node !== 'element') {
      continue;
    }

    // If the element matches selector, push that node onto persistentObj.child.
    let matched = false;
    switch (selectorType) {
      case 'tag':
        if (child.tag && child.tag === selectorName) {
          persistentObj.child.push(child);
          matched = true;
        }
        break;
      case 'id':
        if (child.attr && child.attr.id && child.attr.id === selectorName) {
          persistentObj.child.push(child);
          matched = true;
        }
        break;
      case 'class':
        if (child.attr && child.attr.class && child.attr.class.indexOf(selectorName) > -1) {
          persistentObj.child.push(child);
          matched = true;
        }
        break;
    }

    if (matched) {
      persistentObj.child.push({node: 'text', text: '\n'});
    }

    // Else if recursable, recurse.
    else if (Array.isArray(child.child) && child.child.length) {
      exports.elementSelect(selectorObj, child, persistentObj, level + 1);
    }
  }

  if (!level) {
    return persistentObj;
  }
};

/**
 * Iterate through collection of selected elements. If an index is specified, skip until that index is iterated upon.
 *
 * @param {string} html2jsonObj - An html2json object.
 * @param {string} targetIndex - Optional user submitted index from which the node in html2jsonObj is selected.
 * @return {object} An object containing an html2json object containing all nodes, and another containg only one.
 */
exports.targetHtmlGet = function (html2jsonObj) {
  var allObj = new HtmlObj();
  var children = html2jsonObj.child;
  var elIndex = 0;
  var firstObj = new HtmlObj();

  for (let i = 0; i < children.length; i++) {
    let elObj = children[i];

    if (elObj.node === 'element') {
      if (html2jsonObj.index === -1 || html2jsonObj.index === elIndex) {
        let flag = `\n<!-- BEGIN ARRAY ELEMENT ${elIndex} -->\n`;
        let curr = allObj.child.length - 1;

        if (!elIndex || elIndex === html2jsonObj.index) {
          firstObj.child.push(elObj);
          // TODO: maybe use a factory for this
          firstObj.child.push({node: 'text', text: '\n'});
        }
        else if (curr > -1) {
          allObj.child[curr].text = flag;
        }

        allObj.child.push(elObj);
        allObj.child.push({node: 'text', text: '\n'});
      }
      elIndex++;
    }
  }

  return {all: json2html(allObj), first: json2html(firstObj)};
};

/**
 * @param {string} templateDir - Write destination directory.
 * @param {string} fileName - Filename.
 * @param {string} fileMustache - Mustache file's content.
 * @param {string} fileJson - JSON file's content.
 */
exports.filesWrite = function (templateDir, fileName, fileMustache, fileJson) {
  try {
    fs.writeFileSync(templateDir + '/' + fileName + '.mustache', fileMustache);
    fs.writeFileSync(templateDir + '/' + fileName + '.json', fileJson);
    var msg = 'Go+back+to+the+Pattern+Lab+tab+and+refresh+the+browser+to+check+that+your+template+appears+under+the+';
    msg += 'Scrape+menu.';
    exports.redirectWithMsg('success', msg);

    return;
  }
  catch (err) {
    utils.error(err);
  }
};

/**
 * Sanitize scraped HTML.
 *
 * @param {string} htmlParam - raw HTML.
 * @return {string} Sanitized HTML.
 */
exports.htmlSanitize = function (htmlParam) {
  var html = htmlParam.replace(/<script(.*?)>/g, '<code$1>');
  html = html.replace(/<\/script(.*?)>/g, '</code$1>');
  html = html.replace(/<textarea(.*?)>/g, '<figure$1>');
  html = html.replace(/<\/textarea(.*?)>/g, '</figure$1>');

  return html;
};

exports.htmlToJsons = function (targetHtml) {
  var jsonForMustache = null;
  var dataObj = {html: [{}]};
  var dataKeys = [[]];

  try {
    jsonForMustache = html2json('<body>' + targetHtml + '</body>');
  }
  catch (err) {
    utils.error(err);
  }

  if (jsonForMustache) {
    exports.jsonRecurse(jsonForMustache, dataObj, dataKeys, 0);
  }

  return {jsonForMustache: jsonForMustache, jsonForData: dataObj};
};

/**
 * @param {string} fileName - Filename.
 * @return {boolean} True or false.
 */
exports.isFilenameValid = function (fileName) {
  return fileName.match(/^[A-Za-z0-9][\w\-\.]*$/) ? true : false;
};

exports.jsonRecurse = function (jsonObj, dataObj, dataKeys, incParam) {
  var inc = incParam;
  var tmpObj;
  var suffix;
  var suffixInt;
  var underscored = '';

  if (Array.isArray(jsonObj.child)) {
    for (let i = 0; i < jsonObj.child.length; i++) {
      if (
        jsonObj.child[i].node === 'text' &&
        typeof jsonObj.child[i].text === 'string' &&
        jsonObj.child[i].text.trim()
      ) {

        if (jsonObj.attr) {
          if (typeof jsonObj.attr.id === 'string') {
            underscored = jsonObj.attr.id;
          }
          else if (typeof jsonObj.attr.class === 'string') {
            underscored = jsonObj.attr.class;
          }
        }

        if (!underscored && typeof jsonObj.tag === 'string') {
          underscored = jsonObj.tag;
        }

        if (underscored) {
          underscored = underscored.replace(/-/g, '_').replace(/ /g, '_').replace(/[^\w]/g, '');
          // Add incrementing suffix to dedupe items of the same class or tag.
          for (let j = dataKeys[inc].length - 1; j >= 0; j--) {
            // Check dataKeys for similarly named items.
            if (dataKeys[inc][j].indexOf(underscored) === 0) {
              // Slice off the suffix of the last match.
              suffix = dataKeys[inc][j].slice(underscored.length, dataKeys[inc][j].length);
              if (suffix) {
                // Increment that suffix and append to the new key.
                suffixInt = parseInt(suffix.slice(1), 10);
              }
              else {
                suffixInt = 0;
              }
              underscored += '_' + ++suffixInt;
            }
          }
          tmpObj = {};
          tmpObj[underscored] = jsonObj.child[i].text.trim();
          dataKeys[inc].push(underscored);
          dataObj.html[inc][underscored] = tmpObj[underscored].replace(/"/g, '\\"');
          jsonObj.child[i].text = '{{ ' + underscored + ' }}';
        }
      }
      else if (jsonObj.child[i].node === 'comment' && jsonObj.child[i].text.indexOf(' BEGIN ARRAY ELEMENT ') === 0) {
        inc++;
        dataObj.html[inc] = {};
        dataKeys.push([]);
      }
      else {
        exports.jsonRecurse(jsonObj.child[i], dataObj, dataKeys, inc);
      }
    }
  }
};

/**
 * @param {object} jsonForMustache - JSON for conversion to Mustache syntax.
 * @param {function} resolve - a Promise resolve function.
 * @return {string} XHTML.
 */
exports.jsonToMustache = function (jsonForMustache) {
  var mustache = '<body></body>';

  try {
    mustache = json2html(jsonForMustache);
  }
  catch (err) {
    utils.error(err);
  }

  mustache = beautify(mustache, {indent_size: 2});
  mustache = mustache.replace(/^\s*<body>/, '{{# html }}');
  mustache = mustache.replace(/<\/body>\s*$/, '{{/ html }}\n');

  return mustache;
};

exports.outputHtml = function (jsonForData, targetHtmlParam, mustache) {
  var dataStr = JSON.stringify(jsonForData, null, 2);
  var htmlObj = require('../lib/html');
  var output = '';

  var targetHtml = he.encode(targetHtmlParam).replace(/\n/g, '<br>');

  output += htmlObj.headWithMsg;
  output += '<section>\n';
  output += htmlObj.scraperTitle;
  output += htmlObj.reviewerPrefix;
  output += '<div>' + targetHtml + '</div>';
  output += htmlObj.reviewerSuffix;
  output += htmlObj.importerPrefix;
  output += mustache;
  output += htmlObj.json;
  // Escape double-quotes.
  output += dataStr.replace(/&quot;/g, '&bsol;&quot;');
  output += htmlObj.importerSuffix;
  output += htmlObj.landingBody;
  output += '</section>';
  output += htmlObj.foot;
  output = output.replace('{{ title }}', 'Fepper HTML Scraper');
  output = output.replace('{{ msg_class }}', '');
  output = output.replace('{{ message }}', '');
  output = output.replace('{{ attributes }}', '');
  output = output.replace('{{ url }}', req.body.url);
  output = output.replace('{{ target }}', req.body.target);
  res.end(output);
};

exports.redirectWithMsg = function (type, msg, targetParam, urlParam) {
  if (res) {
    var msgType = type[0].toUpperCase() + type.slice(1);

    var target = typeof targetParam === 'string' ? targetParam : '';
    var url = typeof urlParam === 'string' ? urlParam : '';
    res.writeHead(
      303,
      {
        Location:
          'html-scraper?msg_class=' + type + '&message=' + msgType + '! ' + msg + '&target=' + target + '&url=' + url
      }
    );
    res.end();
  }
};

exports.targetValidate = function (targetParam) {
  var target = targetParam.trim();
  var bracketOpenPos = target.indexOf('[');
  var bracketClosePos = target.indexOf(']');
  var targetIndex = -1;
  var targetIndexStr;
  var targetName = target;

  // Slice target param to extract targetName and targetIndexStr if submitted.
  if (bracketOpenPos > -1) {
    if (bracketClosePos === target.length - 1) {
      targetIndexStr = target.slice(bracketOpenPos + 1, bracketClosePos);
      targetName = target.slice(0, bracketOpenPos);
    }
    else {
      if (req) {
        exports.redirectWithMsg('error', 'Incorrect+submission.', req.body.target, req.body.url);
      }
      return [];
    }
  }

  // Validate that targetName is a css selector.
  if (!targetName.match(/^(#|\.)?[a-z][\w#\-\.]*$/i)) {
    if (req) {
      exports.redirectWithMsg('error', 'Incorrect+submission.', req.body.target, req.body.url);
    }
    return [];
  }

  // If targetIndexStr if submitted, validate it is an integer.
  if (targetIndexStr) {
    if (targetIndexStr.match(/\d+/)) {
      targetIndex = parseInt(targetIndexStr, 10);
    }
    else {
      if (req) {
        exports.redirectWithMsg('error', 'Incorrect+submission.', req.body.target, req.body.url);
      }
      return [];
    }
  }

  return [targetName, targetIndex];
};

exports.main = function (reqParam, resParam) {
  var fileMustache;
  var fileJson;
  var fileName;
  var html2jsonObj;
  var jsonForData;
  var jsonForMustache;
  var jsonFromHtml;
  var mustache;
  var target;
  var targetFirst;
  var targetHtml;
  var targetHtmlObj;
  var templateDir;

  // Set req and res in outer scope.
  req = reqParam;
  res = resParam;

  // HTML scraper action on submission of URL.
  if (typeof req.body.url === 'string' && req.body.url.trim() && typeof req.body.target === 'string') {
    try {
      request(req.body.url, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          exports
            .redirectWithMsg('error', 'Not+getting+a+valid+response+from+that+URL.', req.body.target, req.body.url);
          return;
        }

        jsonForData = new JsonForData();
        jsonFromHtml = html2json(body);
        mustache = '';
        target = req.body.target;
        targetHtml = '';
        html2jsonObj = exports.elementSelect(target, jsonFromHtml);

        if (!html2jsonObj) {
          exports.redirectWithMsg('error', 'Incorrect+submission.', req.body.target, req.body.url);
          return;
        }
        else if (html2jsonObj.child.length) {
          targetHtmlObj = exports.targetHtmlGet(html2jsonObj);

          // Sanitize scraped HTML.
          targetHtml = exports.htmlSanitize(targetHtmlObj.all);
          targetFirst = exports.htmlSanitize(targetHtmlObj.first);

          // Convert HTML to JSON objects for conversion to Mustache and data.
          jsonForData = exports.htmlToJsons(targetHtml).jsonForData;
          jsonForMustache = exports.htmlToJsons(targetFirst).jsonForMustache;

          // Finish conversion to Mustache.
          if (jsonForMustache) {
            mustache = exports.jsonToMustache(jsonForMustache);
          }
          else {
            mustache = targetFirst;
          }
        }

        // Output Mustache.
        exports.outputHtml(jsonForData, targetHtml, mustache);
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
      exports.redirectWithMsg('error', 'Please+enter+a+valid+filename!.', req.body.target, req.body.url);
      return;
    }
    else {
      fileName = req.body.filename;
    }

    templateDir = utils.pathResolve(conf.ui.paths.source.scrape);
    fileMustache = exports.newlineFormat(req.body.mustache);
    fileJson = exports.newlineFormat(req.body.json);
    exports.filesWrite(templateDir, fileName, fileMustache, fileJson);
  }

  // If no form variables sent, redirect back with GET.
  else {
    try {
      exports.redirectWithMsg('error', 'Incorrect+submission.', req.body.target, req.body.url);
      return;
    }
    catch (err) {
      utils.error(err);
    }
  }
};
