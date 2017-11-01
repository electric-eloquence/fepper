/* eslint-disable no-console */
'use strict';

const spawnSync = require('child_process').spawnSync;
const path = require('path');

const binPath = path.resolve('node_modules', '.bin');
const fepperPath = path.resolve('node_modules', 'fepper');
const winGulp = path.resolve(binPath, 'gulp.cmd');

let binGulp = path.resolve(binPath, 'gulp');

// Spawn gulp.cmd if Windows and not BASH.
if (process.env.ComSpec && process.env.ComSpec.toLowerCase() === 'c:\\windows\\system32\\cmd.exe') {
  binGulp = winGulp;
}

// Spawn update task.
spawnSync(binGulp, ['--gulpfile', path.resolve(fepperPath, 'tasker.js'), 'update'], {stdio: 'inherit'});
