'use strict';

const spawnSync = require('child_process').spawnSync;
const fs = require('fs');
const path = require('path');

const confFile = './conf.yml';
const confUiFile = './patternlab-config.json';
const enc = 'utf8';
const fepperPath = path.resolve('node_modules', 'fepper');
const prefFile = './pref.yml';

let extendDir;
let sourceDir;

if (fs.existsSync(confFile)) {
  const confStr = fs.readFileSync(confFile, enc);
  const confLines = confStr.split('\n');

  for (let confLine of confLines) {
    const keyVal = confLine.split(':');

    if (keyVal[0].trim() === 'extend_dir' && keyVal[1]) {
      extendDir = keyVal[1].trim();
    }
  }
}
// confFile may not exists at this point of installation. Hard-code in that case.
else {
  extendDir = 'extend';
}

if (fs.existsSync(confUiFile)) {
  const confUiStr = fs.readFileSync(confUiFile, enc);
  const conf = {ui: JSON.parse(confUiStr)}; // Will throw on error.
  sourceDir = conf.ui && conf.ui.paths && conf.ui.paths.source && conf.ui.paths.source.root;
}

// confUiFile may not exists at this point of installation. Hard-code in that case.
if (!sourceDir) {
  sourceDir = 'source';
}

// Create empty extend and source dirs so the postinstall script doesn't write the main profile there.
const existsAlreadyExtendDir = fs.existsSync(extendDir);
const existsAlreadySourceDir = fs.existsSync(sourceDir);

if (!existsAlreadyExtendDir) {
  fs.mkdirSync(extendDir);
}

if (!existsAlreadySourceDir) {
  fs.mkdirSync(sourceDir);
  fs.mkdirSync(`${sourceDir}/_data`);
  fs.mkdirSync(`${sourceDir}/_patterns`);
  fs.mkdirSync(`${sourceDir}/_styles`);
  fs.writeFileSync(`${sourceDir}/_data/data.json`, '{}');
  fs.writeFileSync(`${sourceDir}/_data/listitems.json`, '{}');
}

const isWindows = (process.env.ComSpec && process.env.ComSpec.toLowerCase() === 'c:\\windows\\system32\\cmd.exe');
const installLog = 'install.log';
let spawnedObj;

// Only run npm install if not already installed.
if (!fs.existsSync('node_modules')) {
  let binNpm = 'npm';

  // Spawn npm.cmd if Windows and not BASH.
  if (isWindows) {
    binNpm = 'npm.cmd';
  }

  spawnedObj = spawnSync(binNpm, ['install', '--ignore-scripts'], {stdio: 'inherit'});
}

if (spawnedObj && spawnedObj.stderr) {
  fs.appendFileSync(installLog, `${spawnedObj.stderr}\n`);
}

if (!fs.existsSync(confFile)) {
  fs.copyFileSync(path.resolve(fepperPath, 'excludes', 'conf.yml'), confFile);
}

if (!fs.existsSync(confUiFile)) {
  fs.copyFileSync(path.resolve(fepperPath, 'excludes', 'patternlab-config.json'), confUiFile);
}

if (!fs.existsSync(prefFile)) {
  fs.copyFileSync(path.resolve(fepperPath, 'excludes', 'pref.yml'), prefFile);
}

// Delete placeholder source and extend dirs so new ones can be copied over.
if (!existsAlreadySourceDir) {
  fs.unlinkSync(`${sourceDir}/_data/listitems.json`);
  fs.unlinkSync(`${sourceDir}/_data/data.json`);
  fs.rmdirSync(`${sourceDir}/_styles`);
  fs.rmdirSync(`${sourceDir}/_patterns`);
  fs.rmdirSync(`${sourceDir}/_data`);
  fs.rmdirSync(sourceDir);
}

if (!existsAlreadyExtendDir) {
  fs.rmdirSync(extendDir);
}

const binPath = path.resolve('node_modules', '.bin');
const winGulp = path.resolve(binPath, 'gulp.cmd');

let binGulp = path.resolve(binPath, 'gulp');

// Spawn gulp.cmd if Windows and not BASH.
if (isWindows) {
  binGulp = winGulp;
}

// Copy over the base profile source dir.
const spawnedObj1 =
  spawnSync(binGulp, ['--gulpfile', path.resolve(fepperPath, 'tasker.js'), 'install:copy-base'], {stdio: 'inherit'});

if (spawnedObj1.stderr) {
  fs.appendFileSync(installLog, `${spawnedObj1.stderr}\n`);
}

// Complete installation. run/install.js handles its own logging so no need to log here.
spawnSync('node', [path.resolve('run', 'install.js')], {stdio: 'inherit'});
