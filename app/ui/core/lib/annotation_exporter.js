'use strict';

var path = require('path');
var glob = require('glob');
var fs = require('fs-extra');
var JSON5 = require('json5');
var mp = require('./markdown_parser');

var annotations_exporter = function (pl) {

  var paths = pl.config.paths;

  /*
  Returns the array of comments wrapped in JSON format.
   */
  function parseAnnotationsJSON() {
    // attempt to read the file
    try {
      var oldAnnotations = fs.readFileSync(path.resolve(paths.source.annotations, 'annotations.json'), 'utf8');
    } catch (ex) {
      if (pl.config.debug) {
        console.log('annotations.json file missing from ' + paths.source.annotations + '. This may be expected.');
      }
      return [];
    }

    try {
      var oldAnnotationsJSON = JSON5.parse(oldAnnotations);
    } catch (ex) {
      console.log('There was an error parsing JSON for ' + paths.source.annotations + 'annotations.json');
      console.log(ex);
      return [];
    }

    var retVal = oldAnnotationsJSON.comments || [];
    return retVal;
  }

  function buildAnnotationMD(annotationsYAML, markdown_parser) {
    var annotation = {};
    var markdownObj = markdown_parser.parse(annotationsYAML);

    annotation.el = markdownObj.el || markdownObj.selector;
    annotation.title = markdownObj.title;
    annotation.comment = markdownObj.markdown;
    return annotation;
  }

  function parseMDFile(annotations, parser) {
    var annotations = annotations;
    var markdown_parser = parser;

    return function (filePath) {
      var annotationsMD = fs.readFileSync(path.resolve(filePath), 'utf8');

    // take the annotation snippets and split them on our custom delimiter
      var annotationsYAML = annotationsMD.split('~*~');
      for (var i = 0; i < annotationsYAML.length; i++) {
        var annotation = buildAnnotationMD(annotationsYAML[i], markdown_parser);
        annotations.push(annotation);
      }
      return false;
    };
  }

  /*
   Converts the *.md file yaml list into an array of annotations
   */
  function parseAnnotationsMD() {
    var markdown_parser = new mp();
    var annotations = [];
    var mdFiles = glob.sync(paths.source.annotations + '/*.md');

    mdFiles.forEach(parseMDFile(annotations, markdown_parser));
    return annotations;
  }

  function gatherAnnotations() {
    var annotationsJSON = parseAnnotationsJSON();
    var annotationsMD = parseAnnotationsMD();

    // first, get all elements unique to annotationsJSON
    var annotationsUnique = annotationsJSON.filter(function (annotationJsObj) {
      var unique = true;
      annotationsMD.forEach(function (annotationMdObj) {
        if (annotationJsObj.el === annotationMdObj.el) {
          unique = false;
          return;
        }
      });
      return unique;
    });

    // then, concat all elements in annotationsMD and return
    return annotationsUnique.concat(annotationsMD);
  }

  return {
    gather: function () {
      return gatherAnnotations();
    },
    gatherJSON: function () {
      return parseAnnotationsJSON();
    },
    gatherMD: function () {
      return parseAnnotationsMD();
    }
  };

};

module.exports = annotations_exporter;
