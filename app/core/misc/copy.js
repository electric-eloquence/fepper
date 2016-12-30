'use strict';

const fs = require('fs');

const copy = require('./copy/copy');

/**
 * If the named dir does not exist in cwd, copy it from immediately within srcDir to cwd.
 * @param {string} dir - The dir to be copied.
 * @param {string} srcDir - The parent directory of dir.
 * @param {function} cb - The callback.
 */
exports.dir = function (dir, srcDir, cb) {
  if (!fs.existsSync(dir)) {
    copy(`${srcDir}/${dir}`, dir, (err) => {
      if (err) {
        throw err;
      }
      if (typeof cb === 'function') {
        cb();
      }
    });
  }
  else if (typeof cb === 'function') {
    cb();
  }
};

/**
 * If the named file does not exist in cwd, copy it from immediately within srcDir to cwd.
 * @param {string} file - The file to be copied.
 * @param {string} srcDir - The parent directory of file.
 * @param {function} cb - The callback.
 */
exports.file = function (file, srcDir, cb) {
  if (!fs.existsSync(file)) {
    fs.readFile(`${srcDir}/${file}`, (err, data) => {
      if (err) {
        throw err;
      }
      fs.writeFileSync(file, data);
      cb();
    });
  }
  else {
    cb();
  }
};
