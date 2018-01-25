<p align="center">
  <img
    src="https://raw.githubusercontent.com/electric-eloquence/fepper-npm/master/excludes/fepper-branding.png"
    alt="Fepper"
  >
</p>

<h2 align="center">A frontend prototyper tool for rapid prototyping of websites</h2>

### Downstream projects

* [Fepper Base](https://github.com/electric-eloquence/fepper-base) - no 
  unnecessary assets, styles, or Pattern Lab demo.
* [Fepper for Drupal](https://github.com/electric-eloquence/fepper-drupal) - 
  templates configured for Drupal 8, along with a Drupal theme built to 
  accommodate those templates.
* [Fepper for Windows](https://github.com/electric-eloquence/fepper-windows) - 
  scripted to run on Windows.
* [Fepper for Wordpress](https://github.com/electric-eloquence/fepper-wordpress) 
  \- templates configured for WordPress, along with a WordPress theme built to 
  accommodate those templates.

### Table of contents

* [Install](#install)
* [Update](#update)
* [Configure](#configure)
* [Use](#use)
* [Global Data](#global-data)
* [Partial Data](#partial-data)
* [Static Site Generation](#static-site-generation)
* [The Backend](#the-backend)
* [Templater](#templater)
* [Webserved Directories](#webserved-directories)
* [Mustache Browser](#mustache-browser)
* [HTML Scraper](#html-scraper)
* [variables.styl](#variables.styl)
* [UI Customization](#ui-customization)
* [Extensions](#extensions)
* [Mobile Devices](#mobile-devices)
* [More Documentation](#more-documentation)

### <a id="install"></a>Install

#### System requirements

* Unix-like or Windows OS.
* Minimum supported Node.js version 8.5.0.

#### Simplest way to get started

* Download the 
  <a href="https://github.com/electric-eloquence/fepper/releases/latest" target="_blank">
  latest release</a>.

#### Main install

* In macOS Finder:
  * Double-click `fepper.command`
  * Among other things, this will install the 
    <a href="https://www.npmjs.com/package/fepper-cli" target="_blank">
    fepper-cli</a>, which will give you the `fp` command.
  * If opening for the first time, macOS may warn that it can't be opened 
    because it is from an unidentified  developer.
      * In that case, Ctrl+click `fepper.command` and click "Open"
      * In the following prompt, click "Open" to confirm that you're sure you 
        want to open it.
  * Enter your password to allow installation.
  * After installation, Fepper should automatically open in a browser.
  * Open http://localhost:3000 if it doesn't open automatically.
* On other Unix-like OSs (or if you prefer working on a BASH-like command line):
  * Install Node.js if it isn't installed already.
  * `npm install -g fepper-cli`
  * `npm install`
  * `fp`
* To stop Fepper, go to the command line where Fepper is running and press 
  Ctrl+c.
* To restart Fepper:
  * Double-click `fepper.command` again.
  * Or enter `fp` on the command line.
* Consult the <a href="http://patternlab.io/docs/index.html" target="_blank">
  Pattern Lab docs</a> for instructions on using Pattern Lab.
* Start editing files in `source`. Changes should automatically appear in the 
  browser.

#### Base install

* Comes with no unnecessary assets, styles, or Pattern Lab demo.
* Node.js must be installed beforehand.
* `npm install -g fepper-cli`
* `npm run install-base`
* `fp`

#### Windows install

* Assumes you haven't checked out the Fepper-Windows project and just need to 
  add the Windows scripts to your project.
* Also assumes you have Node.js installed.
* PowerShell >= 3.0 required.
* Open PowerShell and enter `npm run install-windows`
* In File Explorer, double-click `fepper.vbs` to launch the UI.
* In PowerShell, enter `cscript .\fepper.vbs [task]` to run Fepper tasks.
  * If you Set-ExecutionPolicy to allow ps1 scripts, you may also enter 
    `.\fepper.ps1 [task]`

### <a id="update"></a>Update

Run `fp update` to download and install the latest updates.

### <a id="configure"></a>Configure

Edit `pref.yml` to customize preferences and to view further documentation in 
the comments. If you wish to use the `syncback`, `frontend-copy`, or `template` 
tasks, you must supply values for the `backend.synced_dirs` preferences in order 
for those directories to get processed and copied to the backend.

### <a id="use"></a>Use

* To launch from the macOS Finder:
  * Double-click `fepper.command`
* To launch from the command line:
  * `fp`
* These other utility tasks are runnable on the command line:
  * `fp data` - compile data.json from underscore-prefixed .json files.
  * `fp frontend-copy` - copy assets, scripts, and styles to the backend.
  * `fp help` - print documentation of Fepper tasks.
  * `fp once` - do a one-off Fepper build to the public directory.
  * `fp restart` - restart after shutdown, but without opening the browser.
  * `fp static` - generate a static site from the 04-pages directory.
  * `fp syncback` - combine frontend-copy and template tasks.
  * `fp template` - translate templates in 03-templates for the backend and copy 
    them there.
  * `fp version` - print versions of Fepper NPM, Fepper CLI, and Fepper UI.
* If using Git for version control, directories named "ignore" will be ignored.

### <a id="global-data"></a>Global Data

Edit `source/_data/_data.json` to globally populate Mustache templates with 
data. Manual edits to `source/_data/data.json` will get overwritten on 
compilation.

### <a id="partial-data"></a>Partial Data

Underscore-prefixed .json files within 
`source/_patterns` will be concatenated to the output of `_data.json`, the 
whole in turn getting compiled into `data.json`, the final source of globally 
scoped data. 

_Partial data_ is distinct from _pattern data_. For example, `00-homepage.json` 
is _pattern data_ and specific to the `00-homepage` pattern. No other pattern 
will pick up `00-homepage.json`, even if `00-homepage.mustache` is included in 
another pattern. However, `_00-homepage.json` is _partial data_ and will get 
concatenated to the _global data_ outputted to `data.json`. `_00-homepage.json` 
will be picked up by all patterns.

* **DO NOT EDIT source/_data/data.json**
* **DO PUT GLOBAL DATA IN source/_data/_data.json**
* **DO LIBERALLY USE PARTIAL DATA IN source/_patterns FOR ORGANIZATIONAL SANITY**

### <a id="static-site-generation"></a>Static Site Generation

Running `fp static` will generate a complete static site based on the files in 
`source/_patterns/04-pages`. The site will be viewable at 
http://localhost:3000/static/. An `index.html` will be generated based on 
`04-pages-00-homepage` or whatever is defined as the homepage in `_data.json`. 
If the links are relative and they work correctly in the Fepper UI, they will 
work correctly in the static site even if the `public/static` directory is 
copied and renamed. Just be sure that hard-coded links to other pages in the 
`patterns` directory start with `../04-pages-` and not `../../patterns/04-pages-`. 
Also, `href` and `src` attributes _must_ be wrapped in _double-quotes_.

### <a id="the-backend"></a>The Backend

Fepper can very easily work with a CMS backend such as Drupal or WordPress, 
while not requiring Apache, MySQL, or PHP. Put the actual backend codebase or 
even just a symbolic link to the codebase into the `backend` directory. Then, 
enter the relative paths to the appropriate backend directories in `pref.yml`. 
(Do not include "backend" or a leading slash.) You will then be able to run 
`fp syncback` or `fp frontend-copy` to export your frontend data into your 
backend web application.

* Be sure that `backend.synced_dirs.assets_dir`, 
  `backend.synced_dirs.scripts_dir`, and `backend.synced_dirs.styles_dir` are 
  set in `pref.yml`. 
* The above values set in `pref.yml` can be overridden on a per-file basis by 
  similarly named YAML files with similarly named settings. 
* These YAML files must match the source file's name with exception of the 
  extension. 
* The extension must be `.yml`
* The overriding property must only contain the lowest level key-value, not the 
  entire hierarchy, i.e. only `assets_dir`, `scripts_dir`, or `styles_dir` 
* Files prefixed by "\_\_" will be ignored as will files in the `_nosync` 
  directory at the root of the source directories. 

### <a id="templater"></a>Templater

Fepper's Mustache templates can be translated into templates compatible with 
your backend. Mustache tags just need to be replaced with tags the backend can 
use. Put these translations into YAML files named similarly to the Mustache 
files in `source/_patterns/03-templates`. Follow 
<a href="https://github.com/electric-eloquence/fepper-drupal/blob/dev/source/_patterns/03-templates/page.yml" target="_blank">
this example</a> for the correct YAML syntax. 

Follow these rules for setting up keys and values:

* Delete the Mustache curly braces for keys.
* Trim any exterior whitespace.
* Leave other control structures within the key, i.e., !#/>^
* Escape parentheses, carets, and question marks with a backslash.
* Wrap the key in single quotes.
* Follow the closing quote with a colon, space, pipe, the numeral 2, and a 
  newline `: |2`
* Indent each line of the value by at least two spaces.

Run `fp syncback` or `fp template` to execute the Templater. 

* Be sure that `backend.synced_dirs.templates_dir` and 
  `backend.synced_dirs.templates_ext` are set in `pref.yml`. 
* The default `templates_dir` and `templates_ext` settings in `pref.yml` can be 
  overridden by similarly named settings in the template-specific YAML files. 
* Templates prefixed by "\_\_" will be ignored by the Templater as will files in 
  the `_nosync` directory. 
* The Templater will recurse through nested Mustache templates if the tags are 
  written in the verbose syntax and have the `.mustache` extension, i.e. 
  `{{> 02-components/00-global/00-header.mustache }}`. 
* However, the more common inclusion use-case is to leave off the extension, and 
  not recurse. 

<a href="https://github.com/electric-eloquence/fepper-drupal" target="_blank">
Fepper for Drupal</a> and 
<a href="https://github.com/electric-eloquence/fepper-wordpress" target="_blank">
Fepper for WordPress</a> have working examples of templates compatible with the 
Templater.

### <a id="webserved-directories"></a>Webserved Directories

When using a backend, assets generally need to be shared with the Fepper 
frontend. The `syncback` and `frontend-copy` tasks copy files from Fepper to the 
backend, but not the other way. Instead of providing a task to copy in the 
reverse direction, Fepper serves backend files if their directories are entered 
into the `webserved_dirs` block in `pref.yml`. Be sure these values are 
formatted as YAML array elements.

> DO NOT INCLUDE DIRECTORIES WITH SOURCE CODE! MANY PUBLIC HOSTS DO NOT 
PREPROCESS PHP AND OTHER PROGRAMMING LANGUAGES OUT OF THE BOX, SO ANY PUBLISHED 
SOURCE CODE WILL BE RENDERED AS PLAIN TEXT! THIS WILL MAKE PUBLIC ANY SENSITIVE 
INFORMATION CONTAINED WITHIN THE SOURCE CODE!

### <a id="mustache-browser"></a>Mustache Browser

Mustache code can be viewed in the Fepper UI by clicking the eyeball icon in the 
upper right, then clicking Code, and then clicking the Mustache tab in the 
bottom pane. The Mustache tags are hot-linked, and if they are written in the 
verbose syntax, clicking on them will open that Mustache file and display its 
code in the Fepper UI, with its Mustache tags hot-linked as well. The Mustache 
tags must be coded in the verbose-pathed manner: 
`{{> 02-components/00-global/00-header }}`

The path must be correct; however, the `.mustache` extension is optional. The 
default homepage is a working example.

### <a id="html-scraper"></a>HTML Scraper

Fepper can scrape and import Mustache templates and JSON data files from actual 
web pages. A common use-case is to scrape pages from a backend populated with 
CMS content in order to auto-generate data, and to replicate the HTML structure. 
To open the Scraper, click Scrape in the Fepper UI, and then click HTML 
Scraper. Enter the URL of the page you wish to scrape. Then, enter the CSS 
selector you wish to target (prepended with "#" for IDs and "." for classes). 
Classnames and tagnames may be appended with array index notation ([n]). 
Otherwise, the Scraper will scrape all elements of that class or tag 
sequentially. Such a loosely targeted scrape will save many of the targeted 
fields to a JSON file, but will only save the first instance of the target to 
a Mustache template.

Upon submission, you should be able to review the scraped output on the 
subsequent page. If the output looks correct, enter a filename and submit again. 
The Scraper will save Mustache and JSON files by that name in the 98-scrape 
directory, also viewable under the Scrape menu of the toolbar. The Scraper will 
also correctly indent the Mustache code.

### <a id="variables.styl"></a>variables.styl

`source/_scripts/src/variables.styl` is a file containing variables that can 
be shared across the Stylus CSS preprocessor, browser JavaScripts, and PHP 
backends (and possibly other language backends as well). It ships with these 
values:

```javascript
bp_lg_max = -1
bp_md_max = 1024
bp_sm_max = 767
bp_xs_max = 480
bp_xx_max = 320
bp_xx_min = 0
```

It cannot contain comments, semi-colons, curly braces, etc. It is 
straightforward to import and use these variables in Stylus and JavaScript. PHP 
must import them with `parse_ini_file()`. Fepper tries to be agnostic about CSS 
processors and tries to keep the amount of NPMs to download to a minimum, so it 
does not ship with Stylus (or any other CSS pre/post-processor) configured. 
However, since Stylus allows for this easy sharing of variables, Fepper does 
ship with a `source/_styles/src/stylus` directory. In order to compile it to 
CSS in the `source/_styles/bld` directory, run `npm install` in the `extend` 
directory. Then, uncomment the `stylus:`-prefixed tasks in `extend/contrib.js`. 
The Stylus files are written in the terse, Python-like, indentation-based 
syntax. However, the more verbose, CSS-like syntax (with curly braces, colons, 
and semi-colons) is perfectly valid as well.

The UI's viewport resizer buttons are dependent on the values in this file. The 
default values will configure the XX, XS, SM, and MD buttons to resize the 
viewport to each breakpoint's assigned maximum width. The LG button will resize 
the viewport to a width that is greater than `bp_md_max` by the distance between 
`bp_sm_max` and `bp_md_max`.

Users have the ability to add, modify, or delete values in this file. The UI 
will respect these changes; but keep in mind that additions must be prefixed by 
`bp_` and suffixed by `_max` in order for them to appear as viewport resizer 
buttons. A `-1` value translates to `Number.MAX_SAFE_INTEGER`, and effectively 
means infinity.

### <a id="ui-customization"></a>UI Customization

All aspects of the UI are available for customization. For example, the toolbar 
can accept additions, modifications, and deletions per the needs of end users. 
The UI is built by recursive, functional React calls. The recursion tree is 
reflected by the directory structure containing the modules which compose the 
UI. To override any given module, copy the directory structure leading to the 
module from 
<a href="https://github.com/electric-eloquence/fepper-npm/tree/dev/ui/core/styleguide/index/html" target="_blank">
https&colon;//github.com/electric-eloquence/fepper-npm/tree/dev/ui/core/styleguide/index/html</a> 
to `source/_ui/index/html`, respective to your implementation. Modifications to 
modules in that directory will override the corresponding modules in core. 
Additions (so long as they are correctly nested) will also be recognized.

It is mandatory to componentize style modifications to the UI this way. While it 
is a better practice to componentize scripts this way, generic modifications to 
UI JavaScript can also be added to `source/_scripts/ui-extender.js`.

View All markup can also be overridden by copying the `.mustache` files in 
<a href="https://github.com/electric-eloquence/fepper-npm/tree/dev/ui/core/styleguide/viewall" target="_blank">
https&colon;//github.com/electric-eloquence/fepper-npm/tree/dev/ui/core/styleguide/viewall</a> 
and pasting them to `source/_ui/viewall` (nested correctly). Modifications will 
then be recognized and displayed in the UI. (No additions are allowed.) Custom 
View All styles can be added to regular pattern styles in `source/_styles`.

You will need to compile the UI in order for the browser to pick up custom 
changes to the UI:

```
fp ui:compile
```

New UI customizations will not be picked up simply by restarting Fepper.

You can compile the UI on every build by setting `compileUiOnEveryBuild` to 
`true` in `patternlab-config.json`. However, this is not recommended since it 
would be a drain on performance and simply isn't necessary on every build.

### <a id="extensions"></a>Extensions

The `extend` directory is purposed for extending Fepper's functionality. 
Extensions can be contributed or custom. The `extend` directory will not be 
modified when updating Fepper.

Contributed extensions:

* Install and update contributed extensions with NPM in the `extend` directory.
* Add the tasks to `extend/contrib.js` (and `extend/auxiliary/auxiliary_contrib.js` 
  if necessary) in order for Fepper to run them.

Custom extensions:

* Write custom extensions in the `extend/custom` directory.
* Extensions require a file ending in "~extend.js" in order for Fepper to 
  recognize their tasks.
* The "\*~extend.js" file can be directly under `extend/custom`, or nested one 
  directory deep, but no deeper.
* Add the tasks to `extend/custom.js` (and `extend/auxiliary/auxiliary_custom.js` 
  if necessary) in order for Fepper to run them.

### <a id="mobile-devices"></a>Mobile Devices

The best way to browse the Fepper UI on a mobile device is through the wireless 
connection on your development machine. These are the instructions for doing 
this on a Mac:

If your Mac is connected to the Internet wirelessly:

* Open System Preferences
* Click Network
* In the left pane, select Wi-Fi
* In the right pane, underneath Status, the IP address will be displayed
* On your mobile device, connect to the same wireless network that your Mac is 
  connected to
* Browse http:&#x2F;&#x2F;[IP address]:3000
* Change the port number if Fepper is listening on a different port

If your Mac is connected to the Internet through a wire:

* In the top menu bar, turn Wi-Fi off
* Open System Preferences
* Click Sharing
* In the left pane, select Internet Sharing
* In the right pane, on "Share your connection from:", select the interface 
  which is connected to the Internet
* On "To computers using:", check Wi-Fi
* Click "Wi-Fi Options..."
* This will show your Mac's name as the wireless network name
* Add security if you are in a public space
* Click OK
* Back in the System Preferences main window, in the left pane, check to 
  activate Internet Sharing
* In the dialog that appears, click "Turn Wi-Fi On"
* In the next dialog, click Start
* The Wi-Fi icon in the top menu bar should now be gray with a white up-arrow
* Back in the System Preferences main window, click Network
* In the left pane, select your wired connection
* In the right pane, underneath Status, the IP address will be displayed
* On your mobile device, connect to the wireless network that is the same name 
  as your Mac
* Browse http:&#x2F;&#x2F;[IP address]:3000
* Change the port number if Fepper is listening on a different port

### <a id="more-documentation"></a>More Documentation

* <a href="https://github.com/electric-eloquence/fepper-npm/blob/dev/excludes/pref.yml" target="_blank">
  Default pref.yml</a>
* <a href="http://patternlab.io/docs/index.html" target="_blank">Pattern Lab</a>
* <a href="https://mustache.github.io/mustache.5.html" target="_blank">
  Mustache</a>
