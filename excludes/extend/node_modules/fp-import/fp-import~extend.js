/**
 * @todo Bring a full-fledge Handlebars parser into Pattern Lab, so we can just
 *   drop Handlebars templates from backend to front, and vice-versa, without
 *   modification.
 */
'use strict';

const conf = global.conf;
const pref = global.pref;

const fs = require('fs-extra');
const glob = require('glob');
const gulp = require('gulp');
const path = require('path');
const yaml = require('js-yaml');

const templater = require('../../../core/tasks/templater');
const utils = require('../../../core/lib/utils');

const ROOT_DIR = utils.rootDir();
const TEMPLATES_DIR_DEFAULT = utils.backendDirCheck(ROOT_DIR, pref.backend.synced_dirs.templates_dir);
const TEMPLATES_EXT_DEFAULT = templater.templatesExtCheck(pref.backend.synced_dirs.templates_ext);

// Using an expression instead of a statement only for categorical purposes.
// Keeping consts with consts while defining getDelimiters before FpImporter to
// avoid hoisting.
const getDelimiters = function (engine) {
  switch (engine) {
    case 'erb':
    case 'jsp':
      return ['<%', '%>'];

    case 'hbs':
      return ['\\{\\{[^!]', '\\}\\}'];

    case 'php':
      return ['<\\?', '\\?>'];

    case 'twig':
      return ['\\{%', '%\\}'];
  }

  return null;
};

class FpImporter {
  constructor(file, engine) {
    this.data = {};
    this.engine = engine;
    this.file = file;
    this.targetMustache;
    this.targetMustacheFile = file.replace(/\.yml$/, '.mustache');
    this.sourceDir;
    this.sourceFile;
    this.templatesDir = '';
    this.templatesExt = '';

    var stats;
    var yml;
    try {
      stats = fs.statSync(this.file);
    }
    catch (err) {
      // Fail gracefully.
    }

    // Check if file exists. Read its YAML if it does.
    if (stats && stats.isFile()) {
      try {
        yml = fs.readFileSync(file, conf.enc);
        this.data = yaml.safeLoad(yml);
      }
      catch (err) {
        utils.error(err);
        return;
      }
    }

    if (typeof this.data.templates_dir === 'string') {
      this.templatesDir = utils.backendDirCheck(ROOT_DIR, this.data.templates_dir);
    }
    else {
      this.data.templates_dir = '';
      this.templatesDir = TEMPLATES_DIR_DEFAULT;
    }

    if (typeof this.data.templates_ext === 'string') {
      this.templatesExt = templater.templatesExtCheck(this.data.templates_ext);
    }
    else {
      this.data.templates_ext = '';
      this.templatesExt = TEMPLATES_EXT_DEFAULT;
    }
  }

  setData(data) {
    this.data = data;
  }

  replaceTags() {
    var delimiters = getDelimiters(this.engine);
    if (!delimiters) {
      return;
    }

    var code = fs.readFileSync(this.sourceFile, conf.enc);
    var regex = new RegExp(`${delimiters[0]}(.|\\s)*?${delimiters[1]}`, 'g');

    fs.writeFileSync(this.file, '');
    if (this.data.templates_dir && this.data.templates_dir.trim() !== pref.backend.synced_dirs.templates_dir) {
      fs.appendFileSync(this.file, '"templates_dir": |2\n');
      fs.appendFileSync(this.file, `  ${this.data.templates_dir}`);
    }
    if (this.data.templates_ext && this.data.templates_ext.trim() !== pref.backend.synced_dirs.templates_dir) {
      fs.appendFileSync(this.file, '"templates_ext": |2\n');
      fs.appendFileSync(this.file, `  ${this.data.templates_ext}`);
    }

    this.targetMustache = code;
    this.writeYml(regex, this.engine);
    if (this.engine === 'jsp') {
      this.writeYml(/<\/?\w+:(.|\s)*?>/g, 'jstl');
    }
    fs.writeFileSync(this.targetMustacheFile, this.targetMustache);
  }

  retainMustache() {
    var regex = new RegExp('<!--\\{\\{(.|\\s)*?\\}\\}-->', 'g');
    var matches = this.targetMustache.match(regex);

    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        if (this.engine === 'hbs') {
          this.targetMustache = this.targetMustache.replace(matches[i], `{{${matches[i].slice(7, -3)}`);
        }
        else {
          this.targetMustache = this.targetMustache.replace(matches[i], matches[i].slice(4, -3));
        }
      }
      fs.writeFileSync(this.targetMustacheFile, this.targetMustache);
    }
  }

  writeYml(regex, engine) {
    var matches = this.targetMustache.match(regex);

    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        let key = '';
        let value = '';

        if (i === 0) {
          key = engine;
        }
        else {
          key = `${engine}_${i}`;
        }
        value = matches[i].replace(/^/gm, '  ');
        fs.appendFileSync(this.file, `"${key}": |2\n`);
        fs.appendFileSync(this.file, `${value}\n`);
        this.targetMustache = this.targetMustache.replace(matches[i], `{{ ${key} }}`);
      }
    }
  }

  main() {
    if (this.templatesDir && this.templatesExt) {
      this.sourceDir = utils.backendDirCheck(ROOT_DIR, this.data.templates_dir).replace(`${ROOT_DIR}/`, '');
      this.sourceFile = this.sourceDir + '/' + path.basename(this.file).replace(/\.yml$/, `.${this.templatesExt}`);
      this.replaceTags();
      this.retainMustache();

      // Log to console.
      utils.log(`${this.engine} file \x1b[36m%s\x1b[0m imported.`, this.sourceFile);
    }
  }
}

function importBackendFiles(engine) {
  var files = glob.sync(`${conf.src}/_patterns/03-templates/**/*.yml`);

  for (let i = 0; i < files.length; i++) {
    let fpImporter = {};
    let stats = null;

    try {
      stats = fs.statSync(files[i]);
    }
    catch (err) {
      // Fail gracefully.
    }

    // Only process valid files.
    if (stats && stats.isFile()) {
      try {
        fpImporter = new FpImporter(files[i], engine);
        fpImporter.main();
      }
      catch (err) {
        utils.error(err);
      }
    }
  }

  // Allowing a mass import of files under templates_dir defined in pref.yml.
  // Skips the files processed in the above block.
  if (TEMPLATES_DIR_DEFAULT && TEMPLATES_EXT_DEFAULT) {
    let files1 = glob.sync(`${TEMPLATES_DIR_DEFAULT}/**/*.${TEMPLATES_EXT_DEFAULT}`);

    for (let i = 0; i < files1.length; i++) {
      let data = {};
      let dirP = '';
      let fileYml = '';
      let fpImporter = {};
      let nestedDirs = '';
      let stats = null;

      nestedDirs = path.dirname(files1[i]).replace(`${TEMPLATES_DIR_DEFAULT}`, '');
      fileYml = `${conf.src}/_patterns/03-templates`;
      fileYml += nestedDirs;
      fileYml = `${ROOT_DIR}/${fileYml}`;
      dirP = fileYml;
      fileYml += `/${path.basename(files1[i]).replace(/\.\w+$/, '.yml')}`;

      try {
        stats = fs.statSync(fileYml);
      }
      catch (err) {
        // Fail gracefully.
      }

      // Proceed only fileYml doesn't exist.
      if (!stats) {
        let stats1 = null;

        try {
          stats1 = fs.statSync(dirP);
        }
        catch (err) {
          // Fail gracefully.
        }

        if (!stats1) {
          fs.mkdirsSync(dirP);
        }

        data.templates_dir = pref.backend.synced_dirs.templates_dir + nestedDirs;
        data.templates_dir += (data.templates_dir.slice(-1) !== '\n') ? '\n' : '';
        try {
          fpImporter = new FpImporter(fileYml, engine);
          fpImporter.setData(data);
          fpImporter.main();
        }
        catch (err) {
          utils.error(err);
        }
      }
    }

  }
}

gulp.task('import:erb', function (cb) {
  importBackendFiles('erb');
  cb();
});

gulp.task('import:hbs', function (cb) {
  importBackendFiles('hbs');
  cb();
});

gulp.task('import:jsp', function (cb) {
  importBackendFiles('jsp');
  cb();
});

gulp.task('import:php', function (cb) {
  importBackendFiles('php');
  cb();
});

gulp.task('import:twig', function (cb) {
  importBackendFiles('twig');
  cb();
});
