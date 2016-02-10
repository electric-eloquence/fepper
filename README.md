##Fepper

#A frontend prototyper for rapid website design and development

* [Installation](#installation)
* [Configuration](#configuration)
* [Utilization](#utilization)
* [Static Site Generation](#static-site-generation)
* [The Backend](#the-backend)
* [Webserved Directories](#webserved-directories)
* [GitHub Pages](#github-pages)
* [Templater](#templater)
* [Mustache Browser](#mustache-browser)
* [HTML Scraper](#html-scraper)
* [variables.styl](#variables.styl)
* [More Documentation](#more-documentation)
* [Contributing](#contributing)

###<a id="installation"></a>Installation###

* On Mac OS X:
  * Install Homebrew [http://brew.sh](http://brew.sh)
* On other Unix-like OSs:
  * Permissions might need to be reworked after globally installing NPMs.
  * Global Node modules and their executables are sometimes written to root-owned directories, so NPM commands with the -g option might need to be run as root.
  * However, this sometimes writes root-owned files into $HOME/.npm which needs to be owned entirely by the standard user.
  * If this is the case, be sure to recursively chown $HOME/.npm with the standard user's ownership.
* On non-Unix-like OSs:
  * Sorry, but Fepper is not supported on non-Unix-like OSs.
* Install Node.js and NPM (Node Package Manager).
  * Requires Node.js v4.0.0 at the very least.
  * On a Mac: `brew install node`
  * If already installed, be sure the version is up to date: `node -v`
  * Update if necessary: `brew update && brew upgrade node`
  * If not on a Mac, and not using Homebrew:
[https://github.com/joyent/node/wiki/installing-node.js-via-package-manager](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager)
  * After installing Node, `npm install -g fepper-cli`
* On Mac OS X:
  * Double-click `fepper.command`
* On other OSs (or if you prefer the command line):
  * `npm install`
* After successful installation:
  * Double-click `fepper.command` again
  * Or enter `fp` on the command line.
* Open [http://localhost:3000](http://localhost:3000) in a browser if it doesn't open automatically.
* Consult the [Pattern Lab docs](http://patternlab.io/docs/index.html) for instructions on using Pattern Lab.
* Start editing files in `patternlab-node/source`. Changes should automatically appear in the browser.
* To halt Fepper, go to the command line where Fepper is running and press Ctrl+c.

###<a id="configuration"></a>Configuration###

Edit `conf.yml` for customizing local settings and for general configuration 
information. If you wish to use the `syncback`, `frontend-copy`, or `template` 
tasks, you must supply values for the `backend.synced_dirs` configs in order for 
those directories to get processed and copied to the backend.

You may edit `patternlab-node/source/_data/_data.json` to globally populate 
Mustache templates with data. Underscore-prefixed .json files within 
`source/_patterns` will be concatenated to the output of \_data.json, the whole 
in turn getting compiled into data.json, the final source of globally scoped 
data. Manual edits to data.json will get overwritten on compilation.

When upgrading Fepper, be sure to back up the `patternlab-node/source` directory. 
This is where all custom work is to be done.

If using Git for version control, directories named "ignore" will be ignored.

###<a id="utilization"></a>Utilization###

* To launch from Mac OS X Finder:
  * Double-click `fepper.command`
* To launch from the command line:
  * `fp`
* These other utility tasks are runnable on the command line:
  * `fp data` to force compile data.json.
  * `fp frontend-copy` to copy assets, scripts, and styles to backend.
  * `fp lint` to lint HTML, JavaScripts, and JSON.
  * `fp minify` to minify JavaScripts.
  * `fp once` to clean the public folder and do a one-off Fepper build.
  * `fp publish` to publish the public folder to GitHub Pages.
  * `fp static` to generate a static site from the 04-pages directory.
  * `fp syncback` combines lint, minify, frontend-copy, and template.
  * `fp template` translates templates for backend and copies them there.

###<a id="static-site-generation"></a>Static Site Generation###
Running `fp static` will generate a complete static site based on the files 
in `patternlab-node/source/_patterns/04-pages`. The site will be viewable at
[http://localhost:3000/static/](http://localhost:3000/static/). An `index.html` 
will be generated based on `04-pages-00-homepage` or whatever is defined as the 
homepage in `_data.json`. If the links are relative and they work correctly in 
the Pattern Lab UI, they will work correctly in the static site even if the 
`static` directory is moved and renamed. The only caveat is that links to other 
pages in the `patterns` directory must start with `../04-pages-` and not 
`../../patterns/04-pages-`.

###<a id="the-backend"></a>The Backend###
Fepper can almost as easily work with a CMS backend such as WordPress or Drupal, 
while not requiring Apache, MySQL, or PHP. Put the actual backend codebase or 
even just a symbolic link to the codebase into the `backend` directory. Then, 
enter the relative paths to the appropriate backend directories into `conf.yml`. 
(Do not include "backend" or a leading slash.) You will then be able to run 
`fp syncback`, `fp frontend-copy`, or `fp template` to export your 
frontend data into your backend web application.

###<a id="webserved-directories"></a>Webserved Directories###
When using a CMS backend, assets generally need to be shared with the Fepper 
frontend. The `syncback` and `frontend-copy` tasks copy files from Fepper to the 
backend, but not the other way. Instead of providing a task to copy in the 
reverse direction, Fepper serves backend files if their directories are entered 
into the `webserved_dirs` block in `conf.yml` or `patternlab-node/source/_data/_data.json`. 
Setting `webserved_dirs` in `_data.json` will save that value in version 
control. If `webserved_dirs` is set in both `conf.yml` and `_data.json`, the 
value in `conf.yml` will take priority. Be sure these values are formatted as 
YAML or JSON array elements.

```
DO NOT INCLUDE DIRECTORIES WITH SOURCE CODE! GITHUB PAGES AND MANY OTHER PUBLIC 
HOSTS DO NOT PREPROCESS PHP AND OTHER PROGRAMMING LANGUAGES, SO ANY PUBLISHED 
SOURCE CODE WILL BE RENDERED AS PLAIN TEXT! THIS WILL MAKE PUBLIC ANY SENSITIVE 
INFORMATION CONTAINED WITHIN THE SOURCE CODE!
```

###<a id="github-pages"></a>GitHub Pages###
If you have checked Fepper into a repository in your GitHub account, you may run 
`fp publish` to publish `patternlab-node/public` to GitHub Pages. The 
Pattern Lab UI and Fepper static files will then be viewable from the Web at 
`http://{user}.github.io/{repo}`. Normally, this is all that is needed. However, 
if you are using `webserved_dirs`, you will need to supply a `gh_pages_prefix` 
config in `conf.yml` or `patternlab-node/source/_data/_data.json`. This config 
needs to be set to the name of your GitHub repository and must contain a leading 
slash. Setting `gh_pages_prefix` in `_data.json` will save that value in version 
control. If `gh_pages_prefix` is set in both `conf.yml` and `_data.json`, the 
value in `conf.yml` will take priority.

###<a id="templater"></a>Templater###
Pattern Lab's Mustache templates can be translated into templates compatible 
with your CMS backend. Mustache tags just need to be replaced with tags the CMS 
can use. Put these translations into YAML files named similarly to the Mustache 
files in `patternlab-node/source/_patterns/03-templates`. Follow the example in 
`test/files/_patterns/03-templates/00-homepage.yml` for the correct YAML syntax. 

Follow these rules for setting up keys and values:

* Delete the outer two curly Mustache braces for keys.
* Trim any exterior whitespace.
* Leave other control structures within the key, i.e., !#/>^{}
* Escape parentheses and question marks with two backslashes.
* Wrap the key in double quotes.
* Follow the closing quote with a colon, space, and pipe.
* Indent the first line of the value two spaces.
* Indent all following lines of the value by at least two spaces.

Templates prefixed by "\_\_" will be ignored by the Templater as will files in the 
`_nosync` directory. Be sure that `backend.synced_dirs.templates_dir` and 
`backend.synced_dirs.templates_ext` are set in `conf.yml`. Run `fp syncback` 
or `fp template` to execute the Templater. The Templater will recurse through 
nested Mustache templates if the tags are written in the verbose syntax and 
include the `.mustache` extension, i.e., `{{> 02-organisms/00-global/00-header.mustache }}`. 
When including parameterized partials, be sure string values and keys with 
question marks are wrapped in _single_ quotes.

###<a id="mustache-browser"></a>Mustache Browser###
Mustache code can be viewed in the Pattern Lab UI by clicking the eyeball icon 
in the upper right, then clicking Code, and then clicking the Mustache tab in 
the bottom pane. The Mustache tags are hot-linked, and if they are written in 
the verbose syntax, clicking on them will open that Mustache file and display 
its code in the Pattern Lab UI, with its Mustache tags hot-linked as well. The 
Mustache tags must be coded in this manner: `{{> 02-organisms/00-global/00-header }}`

The path must be correct; however, the `.mustache` extension is optional. The 
default homepage is a working example.

###<a id="html-scraper"></a>HTML Scraper###
Fepper can scrape and import Mustache templates and JSON data files from actual 
web pages, preferably the actual CMS backend that Fepper is prototyping for. To 
open the Scraper, click Scrape in the Pattern Lab UI, and then click HTML 
Scraper. Enter the URL of the page you wish to scrape. Then, enter the CSS 
selector you wish to target (prepended with "#" for IDs and "." for classes). 
Classnames and tagnames may be appended with array index notation ([n]). 
Otherwise, the Scraper will scrape all elements of that class or tag 
sequentially. Such a loosely targeted scrape will save many of the targeted 
fields to the JSON file, but will only save the first instance of the target to 
a Mustache template.

Upon submit, you should be able to review the scraped output on the subsequent 
page. If the output looks correct, enter a filename and submit again. The 
Scraper will save Mustache and JSON files by that name in the 98-scrape 
directory, also viewable under the Scrape menu of the toolbar. The Scraper will 
correctly indent the Mustache code. However, the JSON parsing requires a 
conversion from HTML to XHTML, so don't expect an exact copy of the HTML 
structure of the source HTML.

###<a id="variables.styl"></a>variables.styl###
`patternlab-node/source/scripts/src/variables.styl` is a file containing variables 
that can be shared across the Stylus CSS preprocessor, browser JavaScripts, and 
PHP backends (and possibly other language backends as well). It ships with these 
values:

```
bp_lg_max = -1
bp_lg_min = 1024
bp_md_min = 768
bp_sm_min = 480
bp_xs_min = 0
```

It cannot contain comments, semi-colons, curly braces, etc. It is 
straightforward to import and use these variables in Stylus and JavaScript. PHP 
must import them with `parse_ini_file()`. Fepper tries to be agnostic about CSS 
processors and tries to keep the amount of NPMs to download to a minimum, so it 
does not ship with Stylus (or Sass, Rework, etc) configured. However, since 
Stylus allows for this easy sharing of variables, Fepper does ship with a 
`patternlab-node/source/css-processors/stylus` directory which can be compiled 
into the stock Pattern Lab CSS by configuring `extend/plugins/custom/css-process/css-process_gulp.js`. 
The Stylus files are written in the terse, Python-like, indentation-based 
syntax; however, the more verbose, CSS-like syntax (with curly braces, colons, 
and semi-colons) is perfectly valid as well.

###<a id="more-documentation"></a>More Documentation###

* [default.conf.yml](https://github.com/electric-eloquence/fepper/blob/master/default.conf.yml)
* [Pattern Lab](http://patternlab.io/docs/index.html)
* [Mustache](https://mustache.github.io/mustache.5.html)

###<a id="contributing"></a>Contributing###

Contributions and bug fixes are greatly appreciated!

* Please pull request against the [dev branch](https://github.com/electric-eloquence/fepper/tree/dev).
* Please try to be both concise as well as clear on what is trying to be accomplished.
