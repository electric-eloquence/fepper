(function () {
  'use strict';

  var conf = global.conf;
  var fs = require('fs-extra');
  var gulp = require('gulp');

  var utils = require('../../../core/lib/utils');
  var rootDir = utils.rootDir();

  var FpPln;
  var fpPln;
  var i;
  var multisiteDir = rootDir + '/plugins/contrib/multisite';
  var p;
  var patternNavPartialHtml;
  var patternNavTemplate;
  var plnDir;
  var subsiteDir;
  var subsites = require(multisiteDir + '/subsites.js');
  var version = '0_0_0';

  if (typeof subsites === 'object' && subsites instanceof Array) {
    gulp.task('contrib:multisite', function (cb) {
      var plOverriderFile = rootDir + '/' + conf.src + '/js/patternlab-overrider.js';
      var plOverriderContent = fs.readFileSync(plOverriderFile, conf.enc);

//      if (plOverriderContent.indexOf('(function multisite_' + version) === -1) {
        // Delete other (older) Multisite versions.
        if (plOverriderContent.indexOf('(function multisite_') > -1) {
          plOverriderContent = plOverriderContent.replace(/\n\n\(function multisite_(.|\s)*?}\)\(\);/, '');
        }

        // Begin backticked multi-line string.
        plOverriderContent += `
(function multisite_0_0_0 () {
  'use strict';

  var sgNavContainer = document.getElementById('sg-nav-container');
`;
        // End backticked multi-line string.

        for (i = 0; i < subsites.length; i++) {
          p = new Promise(function (resolve, reject) {
            subsiteDir = multisiteDir + '/' + subsites[i];
            plnDir = subsiteDir + '/patternlab-node';
            process.chdir(plnDir);
            FpPln = require(rootDir + '/core/fp-pln/fp-pln');
            fpPln = new FpPln(subsiteDir, conf);
            fpPln.build();
            /*
            patternNavTemplate = fs.readFileSync(plnDir + '/source/_patternlab-files/partials/patternNav.mustache', conf.enc);
            patternNavPartialHtml = pattern_assembler.renderPattern(patternNavTemplate, patternlab);
console.log(patternNavPartialHtml);
*/
            resolve();
          });
          p.then(function () {
            process.chdir(rootDir);
            cb();
          })
          .catch(function (reason) {
            utils.error(reason);
          });

          // Begin backticked multi-line string.
          plOverriderContent += `
  sgNavContainer.insertAdjacentHTML('afterend', '\\
<div class="fp-nav-container" id="fp-nav-container--` + subsites[i] + `">\\n\\
</div>\\n\\
'
  );
`;
          // End backticked multi-line string.
        }

        plOverriderContent += `})();
`;
//        fs.writeFileSync(plOverriderFile, plOverriderContent);
//      }
    });
  }
})();
