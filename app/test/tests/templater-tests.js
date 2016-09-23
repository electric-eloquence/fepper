'use strict';

const expect = require('chai').expect;
const fs = require('fs-extra');
const path = require('path');

global.appDir = path.normalize(`${__dirname}/../..`);
global.rootDir = path.normalize(`${__dirname}/../../..`);
global.workDir = path.normalize(`${__dirname}/..`);

const utils = require(`${global.appDir}/core/lib/utils`);
utils.conf();
utils.pref();
const conf = global.conf;
const pref = global.pref;
const enc = conf.enc;

const templater = require(`${global.appDir}/core/tasks/templater`);
const patternsDir = `${global.workDir}/${conf.ui.paths.source.patterns}`;
const templatesDir = `${global.workDir}/backend/${pref.backend.synced_dirs.templates_dir}`;
const templatesAlt = `${templatesDir}-alt`;


describe('Templater', function () {
  it('should recurse through Mustache partials', function () {
    var fileFurthest = patternsDir + '/00-elements/03-images/00-logo.mustache';
    var fileRoot = patternsDir + '/03-templates/00-homepage.mustache';
    var code = templater.mustacheRecurse(fileRoot, conf, patternsDir);
    var partial = fs.readFileSync(fileFurthest, conf.enc);

    // Should contain fileFurthest.
    expect(code).to.contain(partial);
  });

  it('should unescape Mustache tags', function () {
    var token = '{ tout }';
    var unescaped = templater.mustacheUnescape(token);

    expect(unescaped).to.equal('{\\stout\\s}');
  });

  it('should write translated templates', function () {
    // Clear out templates dir.
    fs.removeSync(templatesDir + '/*');
    fs.removeSync(templatesAlt + '/*');

    // Run templater.
    templater.main();

    var templateTranslated = fs.statSync(templatesDir + '/00-homepage.tpl.php');
    var templateTranslatedAlt = fs.statSync(templatesAlt + '/02-templater-alt.twig');

    expect(typeof templateTranslated).to.equal('object');
    expect(typeof templateTranslatedAlt).to.equal('object');
  });

  it('should ignore Mustache files prefixed with two undercores', function () {
    var ignored = null;

    try {
      ignored = fs.statSync(templatesDir + '/__01-blog.tpl.php');
    }
    catch (err) {
      // Do nothing.
    }

    expect(ignored).to.equal(null);
  });

  it('should ignore Mustache files in a _nosync directory', function () {
    var ignored = null;

    try {
      ignored = fs.statSync(templatesDir + '/_nosync/00-nosync.tpl.php');
    }
    catch (err) {
      // Do nothing.
    }

    expect(ignored).to.equal(null);
  });

  it('should write to the default templates directory', function () {
    var output = fs.readFileSync(templatesDir + '/00-homepage.tpl.php', conf.enc).trim();

    expect(output).to.equal('<div class="page" id="page"><a href=""><img src="../../_assets/logo.png" class="logo" alt="Logo Alt Text" /></a><?php print $page[\'footer\']; ?></div>');
  });

  it('should write to nested directories within the default templates directory', function () {
    var output = fs.readFileSync(templatesDir + '/nested/00-nested.tpl.php', conf.enc).trim();

    expect(output).to.equal('<div class="page" id="page"><a href=""><img src="../../_assets/logo.png" class="logo" alt="Logo Alt Text" /></a><?php print $page[\'footer\']; ?></div>');
  });

  it('should write to the alternate templates directory', function () {
    var output = fs.readFileSync(templatesAlt + '/02-templater-alt.twig', conf.enc).trim();

    expect(output).to.equal('<p>02-templater-alt.yml overrides "templates_dir" and \'templates_ext\' in pref.yml</p>');
  });
});
