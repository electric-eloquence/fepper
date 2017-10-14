'use strict';

const spawnSync = require('child_process').spawnSync;
const fs = require('fs');
const path = require('path');

const conf = {};
const confUiFile = './patternlab-config.json';

let sourceDir;

if (fs.existsSync(confUiFile)) {
  const confUiStr = fs.readFileSync(confUiFile, 'utf8');

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

// Conf file may not exists at this point of installation. Hard-code in that case.
else {
  sourceDir = 'source';
}

// First, create empty source dir so the postinstall script doesn't write the main profile there.
if (!fs.existsSync(sourceDir)) {
  fs.mkdirSync(sourceDir);
}

// If node_modules dir doesn't exist, run npm install.
if (!fs.existsSync('node_modules')) {
  spawnSync('npm', ['install'], {stdio: 'inherit'});
}

// Check if source dir is already populated.
const sourceDirContent = fs.readdirSync(sourceDir);

// Quit if already populated.
if (sourceDirContent.length) {
  throw `${sourceDir} already has content! Aborting base install!`;
}

// Delete the empty source dir so a new one can be copied over.
fs.rmdirSync(sourceDir);

// Copy over the base profile source dir.
const binGulp = path.resolve('node_modules', '.bin', 'gulp');
const spawnedObj =
  spawnSync(binGulp, ['--gulpfile', 'node_modules/fepper/tasker.js', 'install:copy-base'], {stdio: 'inherit'});

// Output to install.log.
const installLog = 'install.log';

fs.writeFileSync(installLog, '');

if (spawnedObj.stderr) {
  fs.appendFileSync(installLog, `${spawnedObj.stderr}\n`);
}

fs.appendFileSync(installLog, `Process exited with status ${spawnedObj.status}.\n`);

// Compile UI.
spawnSync('node', ['node_modules/fepper/index.js', 'ui:compile'], {stdio: 'inherit'});
