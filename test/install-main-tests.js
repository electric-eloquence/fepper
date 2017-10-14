'use strict';

const expect = require('chai').expect;
const fs = require('fs-extra');

describe('Main Installer', function () {
  it('should copy conf.yml to the root directory', function () {
    expect(fs.existsSync('conf.yml')).to.equal(true);
  });

  it('should copy patternlab-config.json to the root directory', function () {
    expect(fs.existsSync('patternlab-config.json')).to.equal(true);
  });

  it('should complete with pref.yml in the root directory', function () {
    expect(fs.existsSync('pref.yml')).to.equal(true);
  });

  it('should complete with source in the root directory', function () {
    expect(fs.existsSync('source')).to.equal(true);
  });

  it('should copy extend to the root directory', function () {
    expect(fs.existsSync('extend')).to.equal(true);
  });

  it('should install npms in the extend directory', function () {
    expect(fs.existsSync('extend/node_modules')).to.equal(true);
  });

  it('should install npms in the public directory', function () {
    expect(fs.existsSync('public/node_modules')).to.equal(true);
  });

  it('should compile styleguide.html to public/node_modules/fepper-ui/', function () {
    expect(fs.existsSync('public/node_modules/fepper-ui/styleguide.html')).to.equal(true);
  });
});
