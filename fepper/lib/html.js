/**
 * @file
 * Exports the HTML for assembly and token-replacement by the server app.
 */
(function () {
  'use strict';

  exports.head = `
<!DOCTYPE html>
<html>
  <head>
    <title id="title">{{ title }}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">

    <!-- never cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

    <link rel="stylesheet" href="/css/style.css" media="all">
  </head>

  <body style="width: 100%;" class="text {{ class }}">
    <main style="margin: 0 auto;padding-top: 4rem;width: 75rem;">`;

  exports.headNoStyles = `
<!DOCTYPE html>
<html>
  <head>
    <title id="title">{{ title }}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">

    <!-- never cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
  </head>

  <body style="width: 100%;" class="text">
    <main>`;

  exports.scraperTitle = `
      <h1>Fepper HTML Scraper</h1>`;

  exports.landingBody = `
      <form action="/html-scraper" method="post" target="_blank">
        <div>
          <label for="url">Enter URL:</label>
          <input name="url" type="text" value="{{ url }}" style="width: 100%;" />
        </div>
        <div>
          <label for="target">Target Selector:</label>
          <input name="target" type="text" value="{{ target }}" style="width: 100%;" />
        </div>
        <div class="cf" style="padding-top: 1rem;">
          <input name="url-form" type="submit" value="Submit" style="float: left;" />
          <button id="help-button" style="float: right;" onclick="return toggleHelp();">Help</button>
        </div>
      </form>
      <div id="help-text" style="border: 1px solid black;visibility: hidden;margin-top: 5.5rem;padding: 0 2rem;width: 100%">
        <p></p>
        <p>Use this tool to scrape and import Mustache templates and JSON data files from actual web pages, preferably the actual backend webapp that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with "#" for IDs and "." for classes). Classnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that classname sequentially. Such a loosely targeted scrape will save many of the targeted fields to the JSON file, but will only save the first instance of the targeted class to a Mustache template.</p>
<p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save Mustache and JSON files by that name in the 05-scrape directory, also viewable under the Scrape menu of the toolbar.</p>
      </div>`;

  exports.reviewerPrefix = `
      <div style="border: 1px solid black;margin-top: 1rem;overflow-x: scroll;padding: 2rem;width: 100%;">`;

  exports.reviewerSuffix = `
      </div>`;

  exports.importerPrefix = `
      <h3 style="padding-top: 2rem;">Does this HTML look right?</h3>
      <form action="/html-scraper" method="post" name="importer" onsubmit="return validateForm();">
        <div>Yes, import into Fepper.</div>
        <label for="import-form">Enter a filename to save this under:</label>
        <input name="filename" type="text" value="" style="width: 100%" />
        <textarea name="html" style="display: none;">`;

  exports.json = `
        </textarea>
        <textarea name="json" style="display: none;">`;

  exports.importerSuffix = `
        </textarea>
        <input name="import-form" type="submit" value="Submit" style="margin-top: 1rem;" />
      </form>
      <h3 style="padding-top: 2rem;">Otherwise, correct the URL and Target Selector and submit again.</h3>

      <script type="text/javascript">
        function validateForm() {
          var x = document.forms["importer"]["filename"].value;
          if (x == null || x == "") {
            alert("Filename must be filled out.");
            return false;
          }
        }
      </script>`;

  exports.success = `
      <h1 style="color: green;">Installation successful!</h1>
      <p>To start Fepping, just click here: <a href="http://localhost:9001" target="_blank">http://localhost:9001</a></p>
      <p>To halt Fepper, go back to the command line and press Ctrl+c.</p>
      <p>The following documentation is also available in README.md on the command line:</p>`;

  exports.foot = `
    </main>
  </body>
</html>`;
})();
