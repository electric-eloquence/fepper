if (window.location.pathname.indexOf('/styleguide/html/styleguide.html') > -1 && window.location.search === '') {
  window.location = '../../patterns/04-pages-00-homepage/04-pages-00-homepage.html';
}
if (window.location.port === '9001') {
  //<![CDATA[
    document.write('<script type="text/javascript" src="http://HOST:35729/livereload.js"><\/script>'.replace('HOST', location.hostname));
  //]]>
}
