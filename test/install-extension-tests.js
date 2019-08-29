'use strict';

const {expect} = require('chai');
const fs = require('fs-extra');

describe('Extension Installer', function () {
  it('installs npms in /extend/', function () {
    expect(fs.existsSync('extend/node_modules')).to.be.true;
  });
});
