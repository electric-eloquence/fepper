'use strict';

const spawnSync = require('child_process').spawnSync;
const fs = require('fs-extra');
const path = require('path');

const fepperNpmPath = path.resolve('node_modules', 'fepper');
const excludesDir = path.resolve(fepperNpmPath, 'excludes');
const indexJs = path.resolve(fepperNpmPath, 'index.js');

const confFile = 'conf.yml';
const confFileSrc = path.resolve(excludesDir, confFile);

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

const argv = [indexJs, 'install'];
const conf = {};
const spawnedObj = spawnSync('node', argv, {stdio: 'inherit'});

// Output to install.log.
const installLog = 'install.log';

if (spawnedObj.stderr) {
  fs.appendFileSync(installLog, `${spawnedObj.stderr}\n`);
}

fs.appendFileSync(installLog, `Process exited with status ${spawnedObj.status}.\n`);

// Only run ui:compile if source dir is populated. (A base install will have it be empty at this point.)
const confUiStr = fs.readFileSync(confUiFile, 'utf8');

try {
  conf.ui = JSON.parse(confUiStr);
}
catch (err) {
  throw err;
}

const sourceDirContent = fs.readdirSync(conf.ui.paths.source.root);

if (sourceDirContent.length) {
  spawnSync('node', [indexJs, 'ui:compile'], {stdio: 'inherit'});
}
