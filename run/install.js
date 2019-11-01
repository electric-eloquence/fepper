'use strict';

const spawnSync = require('child_process').spawnSync;
const fs = require('fs-extra');
const path = require('path');

const binPath = path.resolve('node_modules', '.bin');
const fepperNpmPath = path.resolve('node_modules', 'fepper');
const excludesDir = path.resolve(fepperNpmPath, 'excludes');
const taskerPath = path.resolve('node_modules', 'fepper', 'tasker.js');
const confFile = 'conf.yml';
const confFileSrc = path.resolve(excludesDir, confFile);

let binGulp = path.resolve(binPath, 'gulp');

// Spawn gulp.cmd if Windows and not BASH.
if (process.env.ComSpec && process.env.ComSpec.toLowerCase() === 'c:\\windows\\system32\\cmd.exe') {
  binGulp = path.resolve(binPath, 'gulp.cmd');
}

if (!fs.existsSync(confFile)) {
  fs.copySync(confFileSrc, confFile);
}

const confUiFile = 'patternlab-config.json';
const confUiFileSrc = path.resolve(excludesDir, confUiFile);

if (!fs.existsSync(confUiFile)) {
  fs.copySync(confUiFileSrc, confUiFile);
}

const prefFile = 'pref.yml';
const prefFileSrc = path.resolve(excludesDir, prefFile);

if (!fs.existsSync(prefFile)) {
  fs.copySync(prefFileSrc, prefFile);
}

const argv = ['--gulpfile', taskerPath];
const spawnedObj = spawnSync(binGulp, argv.concat(['install']), {stdio: 'inherit'});

// Output to install.log.
const installLog = 'install.log';

if (spawnedObj.stderr) {
  fs.appendFileSync(installLog, `${spawnedObj.stderr}\n`);
}

fs.appendFileSync(installLog, `Process exited with status ${spawnedObj.status}.\n`);

// Only run ui:compile if source dir is populated. (A base install will have it be empty at this point.)
const confUiStr = fs.readFileSync(confUiFile, 'utf8');
const conf = {ui: JSON.parse(confUiStr)}; // Will throw on error.
let sourceDirContent = [];

if (conf.ui && conf.ui.paths && conf.ui.paths.source && conf.ui.paths.source.root) {
  sourceDirContent = fs.readdirSync(conf.ui.paths.source.root);
}

if (sourceDirContent.length) {
  spawnSync(binGulp, argv.concat(['ui:compile']), {stdio: 'inherit'});
}
