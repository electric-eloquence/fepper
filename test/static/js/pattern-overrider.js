// Mustache code browser.
var pd = parent.document;
var codeFill = pd.getElementById('sg-code-fill');
if (codeFill) {
  // Give the PL Mustache code viewer the appearance of being linked.
  codeFill.addEventListener('mouseover', function () {
    this.style.cursor = 'pointer';
  });
  // Send to Fepper's Mustache browser when clicking the viewer's Mustache code.
  codeFill.addEventListener('click', function () {
    var code = encodeURIComponent(this.innerHTML);
    var title = pd.getElementById('title').innerHTML.replace('Pattern Lab - ', '');
    window.location = window.location.origin + '/mustache-browser/?title=' + title + '&code=' + code;
    return false;
  });
}

// Redirect away from all-patterns page on launch.
if (window.location.pathname.indexOf('/styleguide/html/styleguide.html') > -1 && window.location.search === '') {
  window.location = '../../patterns/04-pages-00-homepage/04-pages-00-homepage.html';
}

// LiveReload.
if (window.location.port === '3000') {
  //<![CDATA[
    document.write('<script type="text/javascript" src="http://HOST:35729/livereload.js"><\/script>'.replace('HOST', location.hostname));
  //]]>
}
