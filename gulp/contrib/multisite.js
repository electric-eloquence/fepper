(function () {
  'use strict';

  var cheerio = require('cheerio');
  var conf = global.conf;
  var fs = require('fs-extra');
  var glob = require('glob');
  var gulp = require('gulp');
  var path = require('path');
  var plugins = require('gulp-load-plugins')();

  var utils = require('../../core/lib/utils');
  var rootDir = utils.rootDir();
  var FpPln = require(rootDir + '/core/fp-pln/fp-pln');
  var Tasks = require(rootDir + '/core/tasks/tasks');

  var $;
  var multisiteDir = rootDir + '/plugins/contrib/multisite';
  var subsite;
  var subsiteNameError = 'You cannot name a subsite "main"!';
  var subsites = require(multisiteDir + '/subsites');
  var version = '0_0_0';

  function importMustache(from, to) {
    var dest;
    var destDir;
    var i;
    var j;
    var src;
    var siteIncorrectError = 'There doesn\'t appear to be a "' + from + '" site!';

    if (from === 'main') {
      src = glob.sync(rootDir + '/' + conf.src + '/_patterns/**/!(_)*.mustache');
    }
    else {
      src = glob.sync(multisiteDir + '/' + from + '/' + conf.src + '/_patterns/**/!(_)*.mustache');
    }
    if (!src.length) {
      utils.error(siteIncorrectError);
    }

    destDir = multisiteDir + '/' + to + '/' + conf.src + '/_patterns';
    dest = glob.sync(destDir + '/**/!(_)*.mustache');
    if (!dest.length) {
      utils.error(siteIncorrectError);
    }

    for (i = 0; i < src.length; i++) {
      var destTmp = '';
      var srcBasename = path.basename(src[i]).replace(/^\d*\-/, '');
      for (j = 0; j < dest.length; j++) {
        var destBasename = path.basename(dest[j]).replace(/^\d*\-/, '');
        var fromShortPath = path.dirname(src[i]).replace(multisiteDir + '/' + from, '');
        var rootShortPath = path.dirname(src[i]).replace(rootDir, '');
        var toShortPath = path.dirname(dest[j]).replace(multisiteDir + '/' + to, '');
        if (
          srcBasename === destBasename && (
            (from === 'main' && rootShortPath === toShortPath) ||
            (from !== 'main' && fromShortPath === toShortPath)
          )
        ) {
          destTmp = path.dirname(dest[j]) + '/_' + from + '-' + destBasename;
          break;
        }
      }
      if (!destTmp) {
        if (from === 'main') {
          destTmp = path.dirname(src[i]).replace(rootDir, multisiteDir + '/' + to) + '/_' + srcBasename;
        }
        else {
          destTmp = path.dirname(src[i]).replace(multisiteDir + '/' + from, multisiteDir + '/' + to) + '/_' + srcBasename;
        }
      }
      fs.copySync(src[i], destTmp);
      utils.log('Copied \x1b[36m%s\x1b[0m', src[i]);
      utils.log('to \x1b[36m%s\x1b[0m.', destTmp);
    }
  }

  function logImportMessage(from, to) {
    utils.log('Importing Mustache templates from "' + from + '" to "' + to + '"...');
  }

  function subsiteTemplateTaskClosure(taskObj) {
    return function (cb) {
      taskObj.template(rootDir);
      cb();
    };
  }

  function subsitePublishTaskClosure(taskObj) {
    return function (cb) {
      if (typeof conf.gh_pages_src === 'string' && conf.gh_pages_src.trim() &&
          typeof conf.gh_pages_dest === 'string' && conf.gh_pages_dest.trim()
      ) {
        var p = new Promise(function (resolve, reject) {
          process.chdir(rootDir + '/core/tasks');
          taskObj.ghPagesPrefix(rootDir + '/.publish');
          resolve();
        });
        p.then(function () {
          process.chdir(rootDir);
          gulp.src(rootDir + '/' + conf.gh_pages_src + '/**/*')
            .pipe(plugins.ghPages({
              cacheDir: rootDir + '/' + conf.gh_pages_dest
            }));
          cb();
        })
        .catch(function (reason) {
          utils.error(reason);
        });
      }
      else {
        if (typeof conf.gh_pages_src !== 'string' || !conf.gh_pages_src.trim()) {
          utils.error('gh_pages_src not set.');
        }
        if (typeof conf.gh_pages_dest !== 'string' || !conf.gh_pages_dest.trim()) {
          utils.error('gh_pages_dest not set.');
        }
      }
    };
  }

  // ///////////////////////////////////////////////////////////////////////////
  // End plugin-scoped variable and function definitions.
  // Begin Gulp task definitions.
  // ///////////////////////////////////////////////////////////////////////////
  if (typeof subsites === 'object' && subsites instanceof Array && subsites.length) {
    // Populate fpPlns array and tasks object.
    var fpPlns = [];
    var subsiteDir;
    var tasks = {};
    for (var i = 0; i < subsites.length; i++) {
      // Cannot have a subsite named "main". Error and exit if that's the case.
      if (subsites[i] === 'main') {
        utils.error(subsiteNameError);
        return;
      }

      // Instantiate Fepper task objects for all subsites.
      subsiteDir = multisiteDir + '/' + subsites[i];
      fpPlns[i] = new FpPln(subsiteDir, conf);
      tasks[subsites[i]] = new Tasks(subsiteDir, conf);
    }

    gulp.task('contrib:multisite:build', function (cb) {
      var msPatternPaths = {};
      var plnDir;
      var plOverriderFile = rootDir + '/' + conf.src + '/js/patternlab-overrider.js';
      var plOverriderContent = fs.readFileSync(plOverriderFile, conf.enc);

      // Delete pre-existing Multisite function.
      var regex1 = '\\n\\n\\(function multisite_\\d+_\\d+_\\d+';
      var regex2 = '(.|\\s)*?}\\)\\(\\);';
      if (plOverriderContent.match(new RegExp(regex1))) {
        plOverriderContent = plOverriderContent.replace(new RegExp(regex1 + regex2), '');
      }

      // ///////////////////////////////////////////////////////////////////////
      // Begin backticked multi-line string.
      plOverriderContent += `
(function multisite_` + version + ` () {
  "use strict";

  var sgNavContainer = document.getElementById("sg-nav-container");
`;    // End backticked multi-line string.
      // ///////////////////////////////////////////////////////////////////////

      Promise.resolve(0).then(function loop(i) {
        if (i < subsites.length) {
          var patternIndex;
          var patternNavInner;
          var patternNavOuter;
          var $this;

          return new Promise(function (resolve, reject) {
            msPatternPaths[subsites[i]] = {};
            subsiteDir = multisiteDir + '/' + subsites[i];
            plnDir = subsiteDir + '/patternlab-node';
            process.chdir(plnDir);

            patternNavOuter = '<div class="fp-nav-container sg-nav-container" id="fp-nav-container--' + subsites[i] + '">\\n';
            patternNavOuter += '<div class="fp-nav-label">' + subsites[i].toUpperCase() + '</div>\\n<ol class="sg-nav">\\n';

            fpPlns[i].build();

            resolve();
          })
          .then(function () {
            process.chdir(rootDir);

            patternIndex = fs.readFileSync(plnDir + '/public/index.html', conf.enc);
            $ = cheerio.load(patternIndex);

            patternNavInner = $('ol.sg-nav').html();
            patternNavInner = patternNavInner.replace(/\'/g, '\\\'');
            patternNavInner = patternNavInner.replace(/\n/g, '\\n');
            patternNavInner = patternNavInner.replace(/(href=")(patterns)/g, '$1' + subsites[i] + '/$2');
            patternNavInner = patternNavInner.replace(/(href=")(styleguide)/g, '$1' + subsites[i] + '/$2');

            patternNavOuter += patternNavInner;
            patternNavOuter += '\\n</ol>\\n</div>\\n';

            $('a.sg-pop').each(function () {
              $this = $(this);
              msPatternPaths[subsites[i]][$this.attr('data-patternpartial')] = $this.attr('href');
            });

            plOverriderContent += `  sgNavContainer.insertAdjacentHTML('afterend', '`;
            plOverriderContent += patternNavOuter;
            plOverriderContent += `  ');\n`;
          })
          .then(function () {
            return i + 1;
          })
          .then(loop);
        }

        plOverriderContent += `\n  var msPatternPaths = ` + JSON.stringify(msPatternPaths) + `;\n`;

        // /////////////////////////////////////////////////////////////////////
        // Begin backticked multi-line string.
        plOverriderContent += `
  urlHandler.pushPattern = function (pattern, givenPath) {
    var data         = { "pattern": pattern };
    var fileName     = urlHandler.getFileName(pattern);
    var expectedPath = window.location.pathname.replace("public/index.html","public/")+fileName;

    if (givenPath.indexOf(expectedPath) === -1) {
      // make sure to update the iframe because there was a click
      document.getElementById("sg-viewport").contentWindow.postMessage( { "path": fileName }, urlHandler.targetOrigin);
    } else {
      var addressReplacement = (window.location.protocol == "file:") ? null : window.location.protocol+"//"+window.location.host+window.location.pathname.replace("index.html","")+"?p="+pattern;
      var href;
      var sgViewportPathname = document.getElementById("sg-viewport").contentWindow.location.pathname;
      var pathParts = sgViewportPathname.split("/");

      if (pathParts.length > 3 && (
          (pathParts[1] !== "patterns" && pathParts[2] === "patterns") ||
          (pathParts[1] !== "styleguide" && pathParts[2] === "styleguide")))
      {
        addressReplacement += "&subsite="+pathParts[1];
        href = sgViewportPathname.substr(1);
      } else {
        href = urlHandler.getFileName(pattern);
      }

      // add to the history
      history.pushState(data, null, addressReplacement);
      // update title
      document.getElementById("title").innerHTML = "Fepper - "+pattern;
      // insert multisite path into "Open in new window" link
      document.getElementById("sg-raw").setAttribute("href", href);
    }
  };

  /* Pattern Lab accordion dropdown */
  // Accordion dropdown
  $(".fp-nav-container .sg-acc-handle").on("click", function(e){
    e.preventDefault();

    var $this = $(this),
      $panel = $this.next(".fp-nav-container .sg-acc-panel"),
      subnav = $this.parent().parent().hasClass("sg-acc-panel");

    //Close other panels if link isn't a subnavigation item
    if (!subnav) {
      $(".fp-nav-container .sg-acc-handle").not($this).removeClass("active");
      $(".fp-nav-container .sg-acc-panel").not($panel).removeClass("active");
    }

    //Activate selected panel
    $this.toggleClass("active");
    $panel.toggleClass("active");
    setAccordionHeight();
  });

  //Accordion Height
  function setAccordionHeight() {
    var $activeAccordion = $(".fp-nav-container .sg-acc-panel.active").first(),
      accordionHeight = $activeAccordion.height(),
      sh = $(document).height(), //Viewport Height
      $headerHeight = $(".sg-header").height(),
      availableHeight = sh-$headerHeight; //Screen height minus the height of the header

    $activeAccordion.height(availableHeight); //Set height of accordion to the available height
  }

  $(".fp-nav-container .sg-nav-toggle").on("click", function(e){
    e.preventDefault();
    $(".fp-nav-container .sg-nav-container").toggleClass("active");
  });

  // update the iframe with the source from clicked element in pull down menu. also close the menu
  // having it outside fixes an auto-close bug i ran into
  // replacing the default listener
  $(".sg-nav a").not(".sg-acc-handle").off("click", "**");
  $(".sg-nav a").not(".sg-acc-handle").on("click", function(e){

    e.preventDefault();

    // update the iframe via the history api handler
    var targetOrigin = (window.location.protocol == "file:") ? "*" : window.location.protocol+"//"+window.location.host;
    var $this = $(this);
    var navLinkHref = $this.attr("href");
    var hrefParts = navLinkHref.split("/");
    var sgViewportPathname = document.getElementById("sg-viewport").contentWindow.location.pathname;
    var pathnameParts = sgViewportPathname.split("/");

    if (pathnameParts.length > 3 && (
        (pathnameParts[1] !== "patterns" && pathnameParts[2] === "patterns") ||
        (pathnameParts[1] !== "styleguide" && pathnameParts[2] === "styleguide")))
    {
      if (hrefParts.length > 2 && (
          (hrefParts[0] !== "patterns" && hrefParts[1] === "patterns") ||
          (hrefParts[0] !== "styleguide" && hrefParts[1] === "styleguide")))
      {
        navLinkHref = hrefParts.splice(1).join("/");
      } else {
        navLinkHref = "../" + navLinkHref;
      }
    }

    document.getElementById("sg-viewport").contentWindow.postMessage( { "path": navLinkHref }, targetOrigin);

    // close up the menu
    $this.parents(".fp-nav-container .sg-acc-panel").toggleClass("active");
    $this.parents(".fp-nav-container .sg-acc-panel").siblings(".sg-acc-handle").toggleClass("active");

    return false;

  });

  // push viewport down beyond expanded toolbar
  document.getElementById("sg-vp-wrap").style.top = "` + (2.0625 + 2.0625 * subsites.length) + `em";

  // load iframe on parent load
  // possible but unlikely race condition here with the default location.replace
  // will ignore unless it becomes a recurring problem
  var oGetVars = urlHandler.getRequestVars();
  if (typeof oGetVars.subsite === "string" && oGetVars.subsite) {
    if (typeof oGetVars.p === "string" && oGetVars.p) {
      var iFramePath;
      var iFrameLocation = document.getElementById("sg-viewport").contentWindow.location;
      var patternPath;

      patternPath = msPatternPaths[oGetVars.subsite][oGetVars.p];
      iFramePath = window.location.protocol+"//"+window.location.host+"/"+oGetVars.subsite+"/"+patternPath;
      document.getElementById("sg-viewport").contentWindow.location.replace(iFramePath);
      document.getElementById("sg-raw").setAttribute("href", oGetVars.subsite+"/"+patternPath);
    }
  }
})();
`;      // End backticked multi-line string.
        // /////////////////////////////////////////////////////////////////////

        fs.writeFileSync(plOverriderFile, plOverriderContent);
        cb();
      })
      .catch(function (reason) {
        utils.error(reason);
      });
    });

    gulp.task('contrib:multisite:clean', function (cb) {
      Promise.resolve(0).then(function loop(i) {
        if (i < subsites.length) {
          var plnDir;
          var subsiteDir;

          return new Promise(function (resolve, reject) {
            subsiteDir = multisiteDir + '/' + subsites[i];
            plnDir = subsiteDir + '/patternlab-node';
            process.chdir(plnDir);
            fpPlns[i].clean();
            resolve();
          })
          .then(function () {
            process.chdir(rootDir);
          })
          .then(function () {
            return i + 1;
          })
          .then(loop);
        }
        cb();
      })
      .catch(function (reason) {
        utils.error(reason);
      });
    });

    gulp.task('contrib:multisite:copy', function (cb) {
      Promise.resolve(0).then(function loop(i) {
        if (i < subsites.length) {
          var plnDir;
          var subsiteDir;

          return new Promise(function (resolve, reject) {
            subsiteDir = multisiteDir + '/' + subsites[i];
            plnDir = subsiteDir + '/patternlab-node';
            process.chdir(plnDir);
            fpPlns[i].copy();
            resolve();
          })
          .then(function () {
            process.chdir(rootDir);
          })
          .then(function () {
            return i + 1;
          })
          .then(loop);
        }
        cb();
      })
      .catch(function (reason) {
        utils.error(reason);
      });
    });

    gulp.task('contrib:multisite:copy-css', function (cb) {
      Promise.resolve(0).then(function loop(i) {
        if (i < subsites.length) {
          var plnDir;
          var subsiteDir;

          return new Promise(function (resolve, reject) {
            subsiteDir = multisiteDir + '/' + subsites[i];
            plnDir = subsiteDir + '/patternlab-node';
            process.chdir(plnDir);
            fpPlns[i].copyCss();
            resolve();
          })
          .then(function () {
            process.chdir(rootDir);
          })
          .then(function () {
            return i + 1;
          })
          .then(loop);
        }
        cb();
      })
      .catch(function (reason) {
        utils.error(reason);
      });
    });

    gulp.task('contrib:multisite:data', function (cb) {
      function jsonCompileTaskClosure() {
        return function (taskObj) {
          var p = new Promise(function (resolve, reject) {
            taskObj.jsonCompile();
            resolve();
          });
          p.then(function () {
            process.chdir(rootDir);
          })
          .catch(function (reason) {
            utils.error(reason);
          });
        };
      }

      Promise.resolve(0).then(function loop(i) {
        if (i < subsites.length) {
          var jsonCompileTask;
          var plnDir;
          var subsiteDir;

          return new Promise(function (resolve, reject) {
            subsiteDir = multisiteDir + '/' + subsites[i];
            plnDir = subsiteDir + '/patternlab-node';
            process.chdir(plnDir);
            tasks[subsites[i]].appendix();
            resolve();
          })
          .then(function () {
            jsonCompileTask = jsonCompileTaskClosure();
            jsonCompileTask(tasks[subsites[i]]);
          })
          .then(function () {
            return i + 1;
          })
          .then(loop);
        }
        cb();
      })
      .catch(function (reason) {
        utils.error(reason);
      });
    });

    gulp.task('contrib:multisite:frontend-copy-css', function (cb) {
      if (typeof conf.backend.synced_dirs.css_dir === 'string' && conf.backend.synced_dirs.css_dir.match(/^[\w.\/-]+$/)) {
        for (var i = 0; i < subsites.length; i++) {
          gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/css/*')
            .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.css_dir));
        }
      }
      cb();
    });

    gulp.task('contrib:multisite:frontend-copy-fonts', function (cb) {
      if (typeof conf.backend.synced_dirs.fonts_dir === 'string' && conf.backend.synced_dirs.fonts_dir.match(/^[\w.\/-]+$/)) {
        for (var i = 0; i < subsites.length; i++) {
          gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/fonts/*')
            .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.fonts_dir));
        }
      }
      cb();
    });

    gulp.task('contrib:multisite:frontend-copy-images', function (cb) {
      if (typeof conf.backend.synced_dirs.images_dir === 'string' && conf.backend.synced_dirs.images_dir.match(/^[\w.\/-]+$/)) {
        for (var i = 0; i < subsites.length; i++) {
          gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/images/*')
            .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.images_dir));
        }
      }
      cb();
    });

    gulp.task('contrib:multisite:frontend-copy-js', function (cb) {
      if (typeof conf.backend.synced_dirs.js_dir === 'string' && conf.backend.synced_dirs.js_dir.match(/^[\w.\/-]+$/)) {
        for (var i = 0; i < subsites.length; i++) {
          gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/js/*/**/*')
            .pipe(gulp.dest('backend/' + conf.backend.synced_dirs.js_dir));
        }
      }
      cb();
    });

    /**
     * This is normally to be run on the command line since it takes parameters.
     *
     * @param --from
     * @param --to
     */
    gulp.task('contrib:multisite:import', function (cb) {
      var from;
      var to;

      for (var i = 2; i < process.argv.length; i++) {
        switch (process.argv[i]) {
          case '--from':
            if (process.argv[i + 1]) {
              from = process.argv[i + 1];
            }
            break;
          case '--to':
            if (process.argv[i + 1]) {
              to = process.argv[i + 1];
            }
            break;
        }
      }

      // If no args, import if only one active subsite. Import main.
      if (!from && !to) {
        if (subsites.length === 1) {
          logImportMessage('main', subsites[0]);
          importMustache('main', subsites[0]);
        }
        else {
          utils.error('Please enter a "--to" parameter!');
        }
      }
      // If only "from" arg, import if only one active subsite.
      else if (from && !to) {
        if (subsites.length === 1) {
          if (from === subsites[0]) {
            utils.error('Please enter a separate from and to!');
          }
          else {
            logImportMessage(from, subsites[0]);
            importMustache(from, subsites[0]);
          }
        }
        else {
          utils.error('Please enter a "--to" parameter!');
        }
      }
      // If only "to" arg, import main to specified subsite.
      else if (!from && to) {
        if (to === 'main') {
          utils.log(subsiteNameError);
        }
        else {
          logImportMessage('main', to);
          importMustache('main', to);
        }
      }
      else {
        if (to === 'main') {
          utils.log(subsiteNameError);
        }
        else if (from === to) {
          utils.error('Please enter a separate from and to!');
        }
        else {
          logImportMessage(from, to);
          importMustache(from, to);
        }
      }
    });

    gulp.task('contrib:multisite:lint:htmlhint', function (cb) {
      for (var i = 0; i < subsites.length; i++) {
        gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.pub + '/patterns/*/!(index|*escaped).html')
          .pipe(plugins.htmlhint('.htmlhintrc'))
          .pipe(plugins.htmlhint.reporter());
      }
      cb();
    });

    gulp.task('contrib:multisite:lint:htmllint', function (cb) {
      for (var i = 0; i < subsites.length; i++) {
        gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.pub + '/patterns/*/!(index|*escaped).html')
          .pipe(plugins.htmllint());
      }
      cb();
    });

    gulp.task('contrib:multisite:lint:eslint', function (cb) {
      for (var i = 0; i < subsites.length; i++) {
        gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/js/src/**/*.js')
          .pipe(plugins.eslint())
          .pipe(plugins.eslint.format())
          .pipe(plugins.eslint.failAfterError());
      }
      cb();
    });

    gulp.task('contrib:multisite:lint:jsonlint', function (cb) {
      for (var i = 0; i < subsites.length; i++) {
        gulp.src([multisiteDir + '/' + subsites[i] + '/' + conf.src + '/_data/**/*.json', multisiteDir + '/' + subsites[i] + '/' + conf.src + '/_patterns/**/*.json'])
          .pipe(plugins.jsonlint())
          .pipe(plugins.jsonlint.reporter());
      }
      cb();
    });

    gulp.task('contrib:multisite:minify', function (cb) {
      for (var i = 0; i < subsites.length; i++) {
        gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/js/src/**/*.js')
          .pipe(plugins.uglify())
          .pipe(plugins.rename({extname: '.min.js'}))
          .pipe(gulp.dest(conf.src + '/js/min'));
      }
      cb();
    });

    // Create Gulp tasks for publishing individual subsites.
    var subsitePublishTask;
    for (subsite in tasks) {
      if (tasks.hasOwnProperty(subsite)) {
        subsitePublishTask = subsitePublishTaskClosure(tasks[subsite]);
        gulp.task('contrib:multisite:publish:' + subsite, subsitePublishTask);
      }
    }

    gulp.task('contrib:multisite:tcp-ip-load:extend', function (cb) {
      var express = require('express');
      var subsiteDir;

      for (var i = 0; i < subsites.length; i++) {
        subsiteDir = multisiteDir + '/' + subsites[i];
        global.express.use('/' + subsites[i], express.static(subsiteDir + '/' + conf.pub));
      }
      cb();
    });

    gulp.task('contrib:multisite:tcp-ip-reload:assets', function (cb) {
      for (var i = 0; i < subsites.length; i++) {
        gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.pub + '/!(css|patterns|styleguide)/**')
          .pipe(plugins.livereload());
      }
      cb();
    });

    gulp.task('contrib:multisite:tcp-ip-reload:index', function (cb) {
      for (var i = 0; i < subsites.length; i++) {
        gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.pub + '/index.html')
          .pipe(plugins.livereload());
      }
      cb();
    });

    gulp.task('contrib:multisite:tcp-ip-reload:inject', function (cb) {
      for (var i = 0; i < subsites.length; i++) {
        gulp.src(multisiteDir + '/' + subsites[i] + '/' + conf.pub + '/**/*.css')
          .pipe(plugins.livereload());
      }
      cb();
    });

    gulp.task('contrib:multisite:template:all', function (cb) {
      var subsite;

      // Run Fepper templater task for all subsites.
      for (subsite in tasks) {
        if (tasks.hasOwnProperty(subsite)) {
          tasks[subsite].template(rootDir);
        }
      }
      cb();
    });

    // Create Gulp tasks for templating individual subsites.
    var subsiteTemplateTask;
    for (subsite in tasks) {
      if (tasks.hasOwnProperty(subsite)) {
        subsiteTemplateTask = subsiteTemplateTaskClosure(tasks[subsite]);
        gulp.task('contrib:multisite:template:' + subsite, subsiteTemplateTask);
      }
    }

    gulp.task('contrib:multisite:watch', function () {
      // Need delay in order for launch to succeed consistently.
      setTimeout(function () {
        for (var i = 0; i < subsites.length; i++) {
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/_data/!(_)*.json', ['contrib:multisite:build']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/_data/annotations.js', ['contrib:multisite:copy']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/_patternlab-files/**/*.mustache', ['contrib:multisite:build']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/_patterns/**/!(_)*.json', ['contrib:multisite:build']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/_patterns/**/*.mustache', ['contrib:multisite:build']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/_patterns/**/_*.json', ['contrib:multisite:data']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/css/**', ['contrib:multisite:copy-css']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/fonts/**', ['contrib:multisite:copy']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/images/**', ['contrib:multisite:copy']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/js/**', ['contrib:multisite:copy']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.src + '/static/**', ['contrib:multisite:copy']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.pub + '/!(css|patterns|styleguide)/**', ['contrib:multisite:tcp-ip-reload:assets']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.pub + '/**/*.css', ['tcp-ip-reload:inject']);
          gulp.watch(multisiteDir + '/' + subsites[i] + '/' + conf.pub + '/index.html', ['tcp-ip-reload:index']);
        }
      }, conf.timeout_main);
    });
  }
})();
