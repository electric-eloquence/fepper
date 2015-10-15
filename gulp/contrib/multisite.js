(function () {
  'use strict';

  var cheerio = require('cheerio');
  var conf = global.conf;
  var fs = require('fs-extra');
  var gulp = require('gulp');

  var utils = require('../../core/lib/utils');
  var rootDir = utils.rootDir();

  var $;
  var FpPln;
  var fpPln;
  var i;
  var msPatternPaths = {};
  var multisiteDir = rootDir + '/plugins/contrib/multisite';
  var plnDir;
  var subsiteDir;
  var subsites = require(multisiteDir + '/subsites.js');
  var version = '0_0_0';

  if (typeof subsites === 'object' && subsites instanceof Array) {
    gulp.task('contrib:multisite:build', function (cb) {
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

            FpPln = require(rootDir + '/core/fp-pln/fp-pln');
            fpPln = new FpPln(subsiteDir, conf);
            fpPln.build();

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

    gulp.task('contrib:multisite:tcp-ip', function (cb) {
      var express = require('express');

      for (i = 0; i < subsites.length; i++) {
        subsiteDir = multisiteDir + '/' + subsites[i];
        global.express.use('/' + subsites[i], express.static(subsiteDir + '/' + conf.pub));
      }
      cb();
    });
  }
})();
