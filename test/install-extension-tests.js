'use strict';

const expect = require('chai').expect;
const fs = require('fs-extra');

describe('Extension Installer', function () {
  it('should install npms in /extend/', function () {
    expect(fs.existsSync('extend/node_modules')).to.be.true;
  });
});
