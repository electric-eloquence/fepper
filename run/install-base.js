'use strict';

const spawnSync = require('child_process').spawnSync;
const fs = require('fs');
const path = require('path');

const conf = {};
const confFile = './conf.yml';
const confUiFile = './patternlab-config.json';
const enc = 'utf8';

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

  try {
    conf.ui = JSON.parse(confUiStr);
  }
  catch (err) {
    throw err;
  }

  if (conf.ui) {
    sourceDir = conf.ui.paths.source.root;
  }
}
// confUiFile may not exists at this point of installation. Hard-code in that case.
else {
  sourceDir = 'source';
}

// Create empty extend and source dirs so the postinstall script doesn't write the main profile there.
if (!fs.existsSync(extendDir)) {
  fs.mkdirSync(extendDir);
}

if (!fs.existsSync(sourceDir)) {
  fs.mkdirSync(sourceDir);
  fs.mkdirSync(`${sourceDir}/_data`);
  fs.mkdirSync(`${sourceDir}/_patterns`);
  fs.mkdirSync(`${sourceDir}/_styles`);
  fs.writeFileSync(`${sourceDir}/_data/data.json`, '{}');
  fs.writeFileSync(`${sourceDir}/_data/listitems.json`, '{}');
}

// Only run npm install if not already installed.
if (!fs.existsSync('node_modules')) {
  let binNpm = 'npm';

  // Spawn npm.cmd if Windows and not BASH.
  if (process.env.ComSpec && process.env.ComSpec.toLowerCase() === 'c:\\windows\\system32\\cmd.exe') {
    binNpm = 'npm.cmd';
  }

  spawnSync(binNpm, ['install'], {stdio: 'inherit'});
}

// Check if patterns dir is already populated.
const patternsDirContent = fs.readdirSync(`${sourceDir}/_patterns`);

// Return if already populated.
if (patternsDirContent.length) {
  // eslint-disable-next-line no-console
  console.warn(`The ${sourceDir} directory already has content! Aborting base install!`);

  return;
}

// Delete the source and extend dirs so new ones can be copied over.
fs.unlinkSync(`${sourceDir}/_data/listitems.json`);
fs.unlinkSync(`${sourceDir}/_data/data.json`);
fs.rmdirSync(`${sourceDir}/_styles`);
fs.rmdirSync(`${sourceDir}/_patterns`);
fs.rmdirSync(`${sourceDir}/_data`);
fs.rmdirSync(sourceDir);
fs.rmdirSync(extendDir);

const binPath = path.resolve('node_modules', '.bin');
const fepperPath = path.resolve('node_modules', 'fepper');
const winGulp = path.resolve(binPath, 'gulp.cmd');

let binGulp = path.resolve(binPath, 'gulp');

// Spawn gulp.cmd if Windows and not BASH.
if (process.env.ComSpec && process.env.ComSpec.toLowerCase() === 'c:\\windows\\system32\\cmd.exe') {
  binGulp = winGulp;
}

// Copy over the base profile source dir.
const spawnedObj =
  spawnSync(binGulp, ['--gulpfile', path.resolve(fepperPath, 'tasker.js'), 'install:copy-base'], {stdio: 'inherit'});

// Output to install.log.
const installLog = 'install.log';

fs.writeFileSync(installLog, '');

if (spawnedObj.stderr) {
  fs.appendFileSync(installLog, `${spawnedObj.stderr}\n`);
}

fs.appendFileSync(installLog, `Process exited with status ${spawnedObj.status}.\n`);

// Compile UI.
spawnSync('node', [path.resolve(fepperPath, 'index.js'), 'ui:compileui'], {stdio: 'inherit'});
