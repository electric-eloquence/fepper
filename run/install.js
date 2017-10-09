'use strict';

const spawnSync = require('child_process').spawnSync;
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const excludesDir = 'node_modules/fepper/excludes';

const confFile = 'conf.yml';
const confFileSrc = path.resolve(excludesDir, confFile);

if (!fs.existsSync(confFile)) {
  fs.copySync(confFileSrc, confFile);
}

const plConfFile = 'patternlab-config.json';
const plConfFileSrc = path.resolve(excludesDir, plConfFile);

if (!fs.existsSync(plConfFile)) {
  fs.copySync(plConfFileSrc, plConfFile);
}

const prefFile = 'pref.yml';
const prefFileSrc = path.resolve(excludesDir, prefFile);

if (!fs.existsSync(prefFile)) {
  fs.copySync(prefFileSrc, prefFile);
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

const argv = ['node_modules/fepper/index.js', 'install'];

// The "headed" conf is for internal Fepper development only. Necessary when requiring fepper-npm with `npm link`.
if (conf.headed) {
  argv.push('headed');
  argv.push(process.cwd());
}

const spawnedObj = spawnSync('node', argv, {stdio: 'inherit'});

fs.writeFileSync('install.log', `Process exited with status ${spawnedObj.status}.\n`);

if (spawnedObj.stderr) {
  fs.appendFileSync('install.log', `${spawnedObj.stderr}\n`);
}
