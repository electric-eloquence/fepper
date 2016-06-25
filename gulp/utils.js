'use strict';

var utilsFepper = require('../core/lib/utils');

exports.fsContextClosure = function (pathIn, instantiatedObj, fnKey, pathOut, args) {
  return function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      if (Array.isArray(args)) {
        instantiatedObj[fnKey].apply(instantiatedObj, args);
      }
      else {
        instantiatedObj[fnKey]();
      }
      resolve();
    });
    p.then(function () {
      process.chdir(pathOut);
      cb();
    })
    .catch(function (reason) {
      exports.error(reason);
      cb();
    });
  };
};

exports.handleError = function (err) {
  utilsFepper.log(err.toString());
  this.emit('end');
};
