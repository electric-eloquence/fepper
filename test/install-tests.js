'use strict';

const {expect} = require('chai');
const fs = require('fs-extra');

describe('Installer', function () {
  it('copies conf.yml to /', function () {
    expect(fs.existsSync('conf.yml')).to.be.true;
  });

  it('copies patternlab-config.json to /', function () {
    expect(fs.existsSync('patternlab-config.json')).to.be.true;
  });

  it('completes with pref.yml in /', function () {
    expect(fs.existsSync('pref.yml')).to.be.true;
  });

  it('completes with source in /', function () {
    expect(fs.existsSync('source')).to.be.true;
  });

  it('copies extend to /', function () {
    expect(fs.existsSync('extend')).to.be.true;
  });

  it('installs npms in /public/', function () {
    expect(fs.existsSync('public/node_modules')).to.be.true;
  });

  it('compiles index.html to /public/', function () {
    expect(fs.existsSync('public/index.html')).to.be.true;
  });
});
