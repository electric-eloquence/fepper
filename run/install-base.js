'use strict';

const spawnSync = require('child_process').spawnSync;
const fs = require('fs');
const path = require('path');

const sourceDir = 'source'; // Hard-coding out of necessary. No conf file available at this point of installation.

new Promise(resolve => {
  // First, create empty source dir so the postinstall script doesn't write the main profile there.
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir);
  }

  // Then, run npm install.
  spawnSync('npm', ['install'], {stdio: 'inherit'});

  resolve();
})

.then(() => {
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

  if (spawnedObj.stderr) {
    fs.appendFileSync('install.log', `${spawnedObj.stderr}\n`);
  }

  fs.writeFileSync('install.log', `Process exited with status ${spawnedObj.status}.\n`);

  spawnSync('node', ['node_modules/fepper/index.js', 'ui:compile'], {stdio: 'inherit'});
})

.catch(err => {
  console.error('\x1b[31m' + err + '\x1b[0m');
});
