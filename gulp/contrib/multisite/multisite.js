(function () {
  'use strict';

  var cheerio = require('cheerio');
  var conf = global.conf;
  var fs = require('fs-extra');
  var gulp = require('gulp');

  var utils = require('../../../core/lib/utils');
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
    gulp.task('contrib:multisite', function (cb) {
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
(function multisite_0_0_0 () {
  'use strict';

  var sgNavContainer = document.getElementById('sg-nav-container');
`;
      // End backticked multi-line string.

      for (i = 0; i < subsites.length; i++) {
        var patternIndex;
        var patternNavInner;
        var patternNavOuter;

        var p = new Promise(function (resolve, reject) {
          subsiteDir = multisiteDir + '/' + subsites[i];
          plnDir = subsiteDir + '/patternlab-node';
          process.chdir(plnDir);

          patternNavOuter = '<div class="fp-nav-container sg-nav-container" id="fp-nav-container--' + subsites[i] + '">\\n';
          patternNavOuter += '<div class="fp-nav-label">' + subsites[i].toUpperCase() + '</div>\\n<ol class="sg-nav">\\n';

          FpPln = require(rootDir + '/core/fp-pln/fp-pln');
          fpPln = new FpPln(subsiteDir, conf);
          fpPln.build();

          resolve();
        });
        p.then(function () {
          process.chdir(rootDir);

          patternIndex = fs.readFileSync(plnDir + '/public/index.html', conf.enc);
          $ = cheerio.load(patternIndex);

          patternNavInner = $('ol.sg-nav').html();
          patternNavInner = patternNavInner.replace(/\'/g, '\\\'');
          patternNavInner = patternNavInner.replace(/\n/g, '\\n');

          patternNavOuter += patternNavInner;
          patternNavOuter += '\\n</ol>\\n</div>\\n'

          plOverriderContent += `  sgNavContainer.insertAdjacentHTML('afterend', '`;
          plOverriderContent += patternNavOuter;
          plOverriderContent += `');\n`;
          plOverriderContent += '})();\n';

          fs.writeFileSync(plOverriderFile, plOverriderContent);
          cb();
        })
        .catch(function (reason) {
          utils.error(reason);
        });
      }
    });
  }
})();
