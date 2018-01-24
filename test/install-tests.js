'use strict';

const expect = require('chai').expect;
const fs = require('fs-extra');

describe('Installer', function () {
  it('should copy conf.yml to /', function () {
    expect(fs.existsSync('conf.yml')).to.equal(true);
  });

  it('should copy patternlab-config.json to /', function () {
    expect(fs.existsSync('patternlab-config.json')).to.equal(true);
  });

  it('should complete with pref.yml in /', function () {
    expect(fs.existsSync('pref.yml')).to.equal(true);
  });

  it('should complete with source in /', function () {
    expect(fs.existsSync('source')).to.equal(true);
  });

  it('should copy extend to /', function () {
    expect(fs.existsSync('extend')).to.equal(true);
  });

  it('should install npms in /extend', function () {
    expect(fs.existsSync('extend/node_modules')).to.equal(true);
  });

  it('should install npms in /public', function () {
    expect(fs.existsSync('public/node_modules')).to.equal(true);
  });

  it('should compile index.mustache to /node_modules/fepper/ui/core/styleguide/', function () {
    expect(fs.existsSync('node_modules/fepper/ui/core/styleguide/index.mustache')).to.equal(true);
  });
});
