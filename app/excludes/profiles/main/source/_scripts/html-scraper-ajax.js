(function () {
  'use strict';

  // Since the HTML scraper won't work on GitHub Pages or any non-Express served
  // environment, we can safely assume that Fepper will be served from the
  // document root.
  var baseUrl = window.location.protocol + '//' + window.location.host;
  var xhr = new XMLHttpRequest();

  xhr.open('GET', baseUrl + '/' + 'html-scraper-xhr' + window.location.search, true);
  xhr.onload = function () {
    var main = document.getElementsByTagName('main')[0];
    main.innerHTML = xhr.responseText;

    // Insert new script element such that it fires on load.
    var script2insert = document.createElement('script');
    script2insert.src = baseUrl + '/_scripts/html-scraper-dhtml.js';
    var node4insert = document.getElementById('help-text');
    node4insert.parentNode.insertBefore(script2insert, node4insert);
  };
  xhr.send();

})();
