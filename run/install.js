'use strict';

const spawnSync = require('child_process').spawnSync;
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const fepperNpmPath = path.resolve('node_modules', 'fepper');
const excludesDir = path.resolve(fepperNpmPath, 'excludes');
const indexJs = path.resolve(fepperNpmPath, 'index.js');

const confFile = 'conf.yml';
const confFileSrc = path.resolve(excludesDir, confFile);

if (!fs.existsSync(confFile)) {
  fs.copy(confFileSrc, confFile);
}

const confUiFile = 'patternlab-config.json';
const confUiFileSrc = path.resolve(excludesDir, confUiFile);

if (!fs.existsSync(confUiFile)) {
  fs.copy(confUiFileSrc, confUiFile);
}

const prefFile = 'pref.yml';
const prefFileSrc = path.resolve(excludesDir, prefFile);

if (!fs.existsSync(prefFile)) {
  fs.copy(prefFileSrc, prefFile);
}

let conf = {};

// Need to read conf.yml to get the "headed" conf.
try {
  let yml = fs.readFileSync(confFile, 'utf8');
  conf = yaml.safeLoad(yml);
}
catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
}

const argv = [indexJs, 'install'];

// The "headed" conf is for internal Fepper development only. Necessary when requiring fepper-npm with `npm link`.
if (conf.headed) {
  argv.push('headed');
  argv.push(process.cwd());
}

const spawnedObj = spawnSync('node', argv, {stdio: 'inherit'});

// Output to install.log.
const installLog = 'install.log';

if (spawnedObj.stderr) {
  fs.appendFileSync(installLog, `${spawnedObj.stderr}\n`);
}

fs.appendFileSync(installLog, `Process exited with status ${spawnedObj.status}.\n`);

// Only run ui:compileui if source dir is populated. (A base install will have it be empty at this point.)
const confUiStr = fs.readFileSync(confUiFile, 'utf8');

try {
  conf.ui = JSON.parse(confUiStr);
}
catch (err) {
  throw err;
}

const sourceDirContent = fs.readdirSync(conf.ui.paths.source.root);

if (sourceDirContent.length) {
  spawnSync('node', [indexJs, 'ui:compileui'], {stdio: 'inherit'});
}
