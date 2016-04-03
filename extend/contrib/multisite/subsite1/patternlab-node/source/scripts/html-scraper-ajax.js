(function () {
  'use strict';

  // Since the HTML scraper won't work on GitHub Pages or any non-Express served
  // environment, we can safely assume that Fepper will be served from the
  // document root.
  var baseUrl = window.location.protocol + '//' + window.location.host;
  var xhr = new XMLHttpRequest();

  xhr.open('GET', baseUrl + '/' + 'html-scraper-xhr', true);
  xhr.onload = function () {
    var main = document.getElementsByTagName('main')[0];
    main.innerHTML = xhr.responseText;

    // Insert new script element such that it fires on load.
    var script2insert = document.createElement('script');
    script2insert.src = baseUrl + '/scripts/html-scraper-dhtml.js';
    var node4insert = document.getElementById('help-text');
    node4insert.parentNode.insertBefore(script2insert, node4insert);

    // Parse query string.
    var i;
    var key;
    var msg = '';
    var msgType;
    var param;
    var queries = window.location.search.substring(1).split('&');
    var value;

    for (i = 0; i < queries.length; i++) {
      param = queries[i].split('=');
      key = decodeURIComponent(param[0].replace(/\+/g, ' '));
      value = decodeURIComponent(param[1].replace(/\+/g, ' '));
      msgType = key[0].toUpperCase() + key.substring(1);
      msg += msgType + '!: ' + value + '\\n';
    }

    if (msg !== '') {
      // Use JS alert to pause the browser while Pattern Lab auto reloads.
      script2insert = document.createElement('script');
      script2insert.type = 'text/javascript';
      script2insert.innerHTML = 'alert("' + msg + '");';
      node4insert.parentNode.insertBefore(script2insert, node4insert);
    }
  };
  xhr.send();

})();
