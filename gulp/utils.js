'use strict';

var utilsFepper = require('../core/lib/utils');

exports.fsContextClosure = function (pathIn, instantiatedObj, fnKey, pathOut) {
  return function (cb) {
    var p = new Promise(function (resolve, reject) {
      process.chdir(pathIn);
      instantiatedObj[fnKey]();
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
