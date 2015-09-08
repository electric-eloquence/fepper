/**
 * @file
 * Exports the HTML for assembly and token-replacement by the server app.
 */

module.exports.head = '\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title id="title">{{ title }}</title>\n\
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n\
    <meta charset="UTF-8">\n\
\n\
    <!-- never cache -->\n\
    <meta http-equiv="cache-control" content="max-age=0">\n\
    <meta http-equiv="cache-control" content="no-cache">\n\
    <meta http-equiv="expires" content="0">\n\
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">\n\
    <meta http-equiv="pragma" content="no-cache">\n\
\n\
    <link rel="stylesheet" href="/css/style.css" media="all">\n\
  </head>\n\
\n\
  <body style="width: 100%;" class="text {{ class }}">\n\
    <main style="margin: 0 auto;padding-top: 4rem;width: 75rem;">\n';


module.exports.headNoStyles = '\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title id="title">{{ title }}</title>\n\
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n\
    <meta charset="UTF-8">\n\
\n\
    <!-- never cache -->\n\
    <meta http-equiv="cache-control" content="max-age=0">\n\
    <meta http-equiv="cache-control" content="no-cache">\n\
    <meta http-equiv="expires" content="0">\n\
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">\n\
    <meta http-equiv="pragma" content="no-cache">\n\
  </head>\n\
\n\
  <body style="width: 100%;" class="text">\n\
    <main>\n';


module.exports.scraperTitle = '\
      <h1>Fepper HTML Scraper</h1>\n';


module.exports.landingBody = '\
      <form action="/html-scraper" method="post" target="_blank">\n\
        <div>\n\
          <label for="url">Enter URL:</label>\n\
          <input name="url" type="text" value="{{ url }}" style="width: 100%;" />\n\
        </div>\n\
        <div>\n\
          <label for="target">Target Selector:</label>\n\
          <input name="target" type="text" value="{{ target }}" style="width: 100%;" />\n\
        </div>\n\
        <div class="cf" style="padding-top: 1rem;">\n\
          <input name="url-form" type="submit" value="Submit" style="float: left;" />\n\
          <button id="help-button" style="float: right;" onclick="return toggleHelp();">Help</button>\n\
        </div>\n\
      </form>\n\
      <div id="help-text" style="border: 1px solid black;visibility: hidden;margin-top: 5.5rem;padding: 0 2rem;width: 100%">\n\
        <p></p>\n\
        <p>Use this tool to scrape and import Mustache templates and JSON data files from actual web pages, preferably the actual backend webapp that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with "#" for IDs and "." for classes). Classnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that classname sequentially. Such a loosely targeted scrape will save many of the targeted fields to the JSON file, but will only save the first instance of the targeted class to a Mustache template.</p>\n\
<p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save Mustache and JSON files by that name in the 05-scrape directory, also viewable under the Scrape menu of the toolbar.</p>\n\
      </div>\n';


module.exports.reviewerPrefix = '\
<div style="border: 1px solid black;margin-top: 1rem;overflow-x: scroll;padding: 2rem;width: 100%;">\n';


module.exports.reviewerSuffix = '\
</div>\n';


module.exports.importerPrefix = '\
<h3 style="padding-top: 2rem;">Does this HTML look right?</h3>\n\
<form action="/html-scraper" method="post" name="importer" onsubmit="return validateForm();">\n\
  <div>Yes, import into Fepper.</div>\n\
  <label for="import-form">Enter a filename to save this under:</label>\n\
  <input name="filename" type="text" value="" style="width: 100%" />\n\
  <textarea name="html" style="display: none;">\n';


module.exports.json = '\
</textarea>\n\
  <textarea name="json" style="display: none;">\n';


module.exports.importerSuffix = '\
</textarea>\n\
  <input name="import-form" type="submit" value="Submit" style="margin-top: 1rem;" />\n\
</form>\n\
<h3 style="padding-top: 2rem;">Otherwise, correct the URL and Target Selector and submit again.</h3>\n\
\n\
<script type="text/javascript">\n\
  function validateForm() {\n\
    var x = document.forms["importer"]["filename"].value;\n\
    if (x == null || x == "") {\n\
      alert("Filename must be filled out.");\n\
      return false;\n\
    }\n\
  }\n\
</script>\n';


module.exports.success = '\
<h1 style="color: green;">Installation successful!</h1>\n\
<p>To start Fepping, just click here: <a href="http://localhost:9001" target="_blank">http://localhost:9001</a></p>\n\
<p>To halt Fepper, go back to the command line and press Ctrl+c.</p>\n\
<p>The following documentation is also available in README.md on the command line:</p>\n';


module.exports.foot = '\
    </main>\n\
  </body>\n\
</html>';
