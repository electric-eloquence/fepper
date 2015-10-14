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

      // Begin backticked multi-line string.
      plOverriderContent += `
(function multisite_` + version + ` () {
  'use strict';

  var sgNavContainer = document.getElementById('sg-nav-container');
`;    // End backticked multi-line string.

      Promise.resolve(0).then(function loop(i) {
        if (i < subsites.length) {
          var patternIndex;
          var patternNavInner;
          var patternNavOuter;

          return new Promise(function (resolve, reject) {
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

            patternNavOuter += patternNavInner;
            patternNavOuter += '\\n</ol>\\n</div>\\n';

            plOverriderContent += `  sgNavContainer.insertAdjacentHTML('afterend', '`;
            plOverriderContent += patternNavOuter;
            plOverriderContent += `  ');\n`;
          })
          .then(function () {
            return i + 1;
          })
          .then(loop);
        }

        // Begin backticked multi-line string.
        plOverriderContent += `
  document.getElementById('sg-vp-wrap').style.top = '` + (2.0625 + 2.0625 * subsites.length) + `em';

  /* Pattern Lab accordion dropdown */
  // Accordion dropdown
  $('.fp-nav-container .sg-acc-handle').on("click", function(e){
    e.preventDefault();

    var $this = $(this),
      $panel = $this.next('.fp-nav-container .sg-acc-panel'),
      subnav = $this.parent().parent().hasClass('sg-acc-panel');

    //Close other panels if link isn't a subnavigation item
    if (!subnav) {
      $('.fp-nav-container .sg-acc-handle').not($this).removeClass('active');
      $('.fp-nav-container .sg-acc-panel').not($panel).removeClass('active');
    }

    //Activate selected panel
    $this.toggleClass('active');
    $panel.toggleClass('active');
    setAccordionHeight();
  });

  $('.fp-nav-container .sg-nav-toggle').on("click", function(e){
    e.preventDefault();
    $('.fp-nav-container .sg-nav-container').toggleClass('active');
  });

  // update the iframe with the source from clicked element in pull down menu. also close the menu
  // having it outside fixes an auto-close bug i ran into
  $('.fp-nav-container .sg-nav a').not('.fp-nav-container .sg-acc-handle').on("click", function(e){

	e.preventDefault();

	// update the iframe via the history api handler
	document.getElementById("sg-viewport").contentWindow.postMessage( { "path": urlHandler.getFileName($(this).attr("data-patternpartial")) }, urlHandler.targetOrigin);

	// close up the menu
	$(this).parents('.fp-nav-container .sg-acc-panel').toggleClass('active');
	$(this).parents('.fp-nav-container .sg-acc-panel').siblings('.sg-acc-handle').toggleClass('active');

	return false;

  });
})();
`;      // End backticked multi-line string.

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








