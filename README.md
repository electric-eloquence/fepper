<p align="center">
  <img
    src="https://raw.githubusercontent.com/electric-eloquence/fepper-npm/master/excludes/fepper-branding.png"
    alt="Fepper"
  >
</p>

<h2 align="center">A frontend prototyper tool for rapid prototyping of websites</h2>

[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Linux Build Status][linux-image]][linux-url]
[![Mac Build Status][mac-image]][mac-url]
[![Windows Build Status][windows-image]][windows-url]
![Node Version][node-version-image]
[![License][license-image]][license-url]

### Downstream projects

* [Fepper Base](https://github.com/electric-eloquence/fepper-base) - no 
  unnecessary assets, styles, demo website, or 
  <a href="https://www.npmjs.com/package/fp-stylus" target="_blank">fp-stylus</a> 
  extension.
* [Fepper for Drupal](https://github.com/electric-eloquence/fepper-drupal) - 
  templates configured for Drupal, along with a Drupal theme built to 
  accommodate those templates.
* [Fepper for Wordpress](https://github.com/electric-eloquence/fepper-wordpress) 
  \- templates configured for WordPress, along with a WordPress theme built to 
  accommodate those templates.

### Table of contents

* [Install](#install)
* [Configure](#configure)
* [Run](#run)
* [Update](#update)
* [Global Data](#global-data)
* [Partial Data](#partial-data)
* [Markdown Content](#markdown-content)
* [Code Viewer](#code-viewer)
* [Requerio Inspector](#requerio-inspector)
* [Static Site Generator](#static-site-generator)
* [The Backend](#the-backend)
* [Templater](#templater)
* [Webserved Directories](#webserved-directories)
* [HTML Scraper](#html-scraper)
* [variables.styl](#variables.styl)
* [UI Customization](#ui-customization)
* [Extensions](#extensions)
* [Express App](#express-app)
* [Mobile Devices](#mobile-devices)
* [I18N](#i18n)
* [Keyboard Shortcuts](#keyboard-shortcuts)
* [More Documentation](#more-documentation)

### <a id="install"></a>Install

#### System requirements

* Unix-like or Windows OS.
* Minimum supported Node.js version 18.0.0.

#### Simplest way to get started

* Download the 
  <a href="https://github.com/electric-eloquence/fepper/releases/latest" target="_blank">
  latest release</a>.

#### Mac install

* In macOS Finder:
  * Double-click `fepper.command`.
  * If not already installed, this will install:
    * Node.js.
    * <a href="https://www.npmjs.com/package/fepper-cli" target="_blank">fepper-cli</a>, 
      which will give you the `fp` command.
  * If opening for the first time, macOS may warn that it can't be opened 
    because it is from an unidentified 
    developer.&nbsp;<a href="https://gist.github.com/e2tha-e/72364ca766cf5d2d1a732b6af4f3b7a8" target="_blank">*</a>
    * In this case, ctrl+click `fepper.command` and click "Open".
    * In the following prompt, click "Open" to confirm that you're sure you 
      want to open it.
  * Enter your password to allow installation.
  * After installation, Fepper should automatically open in a browser.
  * Open http://localhost:3000 if it doesn't open automatically.

#### CLI install

* In Linux and other Unix-like OSs (or if you prefer working on the command 
  line):
  * Install Node.js if it isn't already installed.
  * `npm install -g fepper-cli`
  * `npm install`
  * `fp`

#### Windows install

* In File Explorer, double-click 
  `fepper.vbs`.&nbsp;<a href="https://gist.github.com/e2tha-e/72364ca766cf5d2d1a732b6af4f3b7a8" target="_blank">*</a>
  * If Node.js is not installed, this will install it.
  * After Node.js installation, double-click `fepper.vbs` again.
    * This will install <a href="https://www.npmjs.com/package/fepper-cli" target="_blank">
      fepper-cli</a>, which will give you the `fp` command.
    * It will then install and launch Fepper.

#### Base install

* Comes with no unnecessary assets, styles, demo website, or 
  <a href="https://www.npmjs.com/package/fp-stylus" target="_blank">fp-stylus</a> 
  extension.
* Node.js must be installed beforehand.
* `npm install -g fepper-cli`
* `npm run install-base`
* `fp`

#### Post-install

* To stop Fepper, go to the command line where Fepper is running and press 
  ctrl+c.

### <a id="configure"></a>Configure

Fepper will run perfectly well out-of-the-box with default configurations. For 
further customization, power-users can edit these files:

* conf.yml
* pref.yml
* patternlab-config.json

Edit `conf.yml` to suit the needs of your development environment. If using Git, 
`conf.yml` will not be version controlled by default.

Edit `pref.yml` to customize Fepper preferences. If you wish to use the 
`fp syncback`, `fp frontend-copy`, or `fp template` tasks, you must supply 
values for the `backend.synced_dirs` preferences in order for those directories 
to get processed and copied to the backend.

Edit `patternlab-config.json` to configure Pattern Lab, the design system behind 
the Fepper UI.

### <a id="run"></a>Run

* To launch from macOS Finder:
  * Double-click `fepper.command`.
* To launch from Windows File Explorer:
  * Double-click `fepper.vbs`.
* To launch from the command line:
  * `fp`
* Consult the <a href="https://fepper.io/docpage" target="_blank">
  Fepper website</a> for documentation.
* Start editing files in `source`. Changes should automatically appear in the 
  browser.
* To stop Fepper, press ctrl+c.
* These other utility tasks are runnable on the command line:
  * `fp data` - Build data.json from underscore-prefixed .json files
  * `fp frontend-copy` - Copy assets, scripts, and styles to the backend
  * `fp help` - Print documentation of Fepper tasks
  * `fp once` - Output a new build to the public directory
  * `fp restart` - Restart after shutdown, but without opening the browser
  * `fp static` - Generate a static site from the 04-pages directory
  * `fp syncback` - Combine frontend-copy and template tasks
  * `fp template` - Translate templates in 03-templates for the backend, and 
    output them there
  * `fp ui:help` - Print UI tasks and their descriptions
  * `fp update` - Update Fepper distro, Fepper CLI, Fepper NPM, Fepper UI, and 
    Fepper extensions
  * `fp version` - Print the versions of Fepper CLI, Fepper NPM, and Fepper UI
  * `fp extend:help` - Print extension tasks and their descriptions
* Enter a `-d` or `--debug` switch to run the command in `debug` mode.
* If using Git for version control, directories named "ignore" will be ignored.

### <a id="update"></a>Update

Run `fp update` to download and install the latest updates.

### <a id="global-data"></a>Global Data

Edit `source/_data/_data.json` to globally populate 
<a href="https://www.npmjs.com/package/feplet" target="_blank">Feplet</a> 
(.mustache) templates with data. _Never_ edit `source/_data/data.json` as it 
will get overwritten on each build.

### <a id="partial-data"></a>Partial Data

Underscore-prefixed .json files within 
`source/_patterns` will be concatenated to the output of `_data.json`, the 
whole in turn getting built into `data.json`, the final source of globally 
scoped data. 

_Partial data_ is distinct from _pattern data_. For example, `01-blog.json` 
is _pattern data_ and specific to the `01-blog` pattern. No other pattern 
will pick up `01-blog.json`, even if `01-blog.mustache` is included in 
another pattern. However, `_01-blog.json` is _partial data_ and will get 
concatenated to the _global data_ outputted to `data.json`. `_01-blog.json` 
will be picked up by all patterns.

* **DO NOT EDIT source/_data/data.json**
* **DO PUT GLOBAL DATA IN source/_data/_data.json**
* **DO LIBERALLY USE PARTIAL DATA IN source/_patterns FOR ORGANIZATIONAL SANITY**

### <a id="markdown-content"></a>Markdown Content

Fepper provides the convenience of managing content in 
<a href="https://daringfireball.net/projects/markdown/syntax" target="_blank">
Markdown</a>. To do so, create a `.md` file of the same name as the pattern. 
Edit this file in Front Matter syntax like so:

##### example.md:

```
---
content_key: content
---
# Heading

Sample body content
```

Front Matter comprises YAML between the `---` lines and Markdown below them. It 
doesn't appear to have a unified spec, so searches for documentation will 
probably just list various implementations. In any case, `content_key` can be 
any valid whitespace-free string. Use it to identify its corresponding tag in 
the `.mustache` file like so:

##### example.mustache:

```
<main id="content">
  {{{ content }}}
</main>
```

Once properly set up, the Markdown can be edited in the 
[Code Viewer](https://fepper.io/docpage--code-viewer.html).

When creating `.md` files for pseudo-patterns, replace the `.json` extension 
while leaving the rest of the filename intact.

### <a id="code-viewer"></a>Code Viewer

<a href="https://www.npmjs.com/package/feplet" target="_blank">Feplet</a> 
(.mustache) code can be viewed in the Fepper UI by clicking the eyeball icon in 
the upper right and then clicking Code. The Code Viewer will then be opened, 
displaying the Feplet code of the pattern, and the partials tags within will be 
hot-linked to open their respective patterns in the main panel of the Fepper UI. 

If the pattern has an associated `.md` file, its Markdown code can be viewed by 
clicking the "Markdown" tab. In order for the Code Viewer to allow edits to the 
Markdown, Fepper must be LiveReloading correctly. In most cases, LiveReload 
will just work out-of-the-box.

If the project was set up with Git, the Markdown edits can be version controlled 
with the Code Viewer's Git Interface as well.

Most Developers should be familiar with setting up projects with Git. It is 
beyond the scope of this document to provide much further instruction on Git. 
However, Editors are encouraged to version-control their edits with Git if 
collaborating with others.

In order to get Editors set up with Git, first make sure Git is installed. Then, 
install <a href="https://github.com/cli/cli#readme" target="_blank">GitHub CLI
</a> (macOS and Windows only). A CLI requires a Terminal app, but Editors will 
generally only need this for setup and background operations. In fact, much of 
the setup can be automated within clickable scripts.

To proceed, an account must be registered at GitHub&#46;com, and GitHub CLI 
installed as per the instructions in the previous link. Then, run the following 
in the Terminal:

##### macOS and Windows:

```
git config --global user.email name@email.address
git config --global user.name 'User Name'
gh auth login
```

After issuing the `gh auth login` command, press Enter to accept each default. 
After accepting to login with a web browser, press Enter to open the 
GitHub&#46;com authentication webpage. Sign in to GitHub if necessary. Then, 
enter the 8-character code from the Terminal. Click to Authorize github. If the 
webpage shows success, return to the Terminal. It should say, "Authentication 
complete. Press Enter to continue..."

After pressing Enter to exit the prompt, Editors should be able to use the Git 
Interface with no more prompts for authentication.

##### Linux and other Unix-like OSs:

It is not recommended to use Fepper's graphical Git Interface in Linux and 
other, more obscure Unix-like OSs. It is not straightforward to authenticate 
with GitHub CLI in such OSs. The technical knowledge required to authenticate 
would be better applied using Git as intended for Developers.

### <a id="requerio-inspector"></a>Requerio Inspector

The Code Viewer also has a Requerio Inspector. 
<a href="https://github.com/electric-eloquence/requerio#readme" target="_blank">
Requerio</a> is a tool you can use to manage the state of your web application. 
HTML elements given state are referred to as "organisms". In order to view their 
states, Requerio and its organisms need to be initialized as per the 
<a href="https://github.com/electric-eloquence/requerio#readme" target="_blank">
Requerio docs</a>. It is necessary to define `window.requerio` in order for the 
Requerio Inspector to work, as per the following code example:

```
const requerio = window.requerio = new Requerio($, Redux, $organisms);
```

A properly working Requerio app will then have its organisms and their states 
show up in the Requerio Inspector like an expandable menu, the state tree. 
Hovering over the state tree should highlight the organism being inspected. (It 
may be necessary to give the organisms a CSS background-color in order for the 
highlighting to work.) The display of the states will update in real-time, 
should there be any changes to the organisms. You can even dispatch changes 
("actions") to the organisms via your browser's Developer Tools:

* Use your cursor to inspect the Requerio organism you wish to dispatch actions 
  on.
* This should open the Inspector or Elements tab of the Developer Tools.
* Click the adjacent tab to open the Console of the Developer Tools.
* Enter the following example in the Console:
* `requerio.$orgs['#nav'].dispatchAction('css', {backgroundColor: 'green'})`
* If not on the default demo site, or if the `#nav` element doesn't exist, replace 
  `#nav` with your own selector, and the arguments with your own arguments.
* The state change should show up in the Requerio Inspector.
* <a href="https://github.com/electric-eloquence/requerio/blob/dev/docs/methods.md" target="_blank">
  Action methods and their arguments</a>.

### <a id="static-site-generator"></a>Static Site Generator

Running `fp static` will generate a complete static site based on the files in 
`source/_patterns/04-pages`. The site will be viewable at 
http://localhost:3000/static/. An `index.html` will be generated based on 
whatever is declared as the `defaultPattern` in `patternlab-config.json`. If 
links to other pages in the `04-pages` directory work correctly in the Fepper 
UI, they will work correctly in the static site, even if the `public/static` 
directory is copied and renamed.

For example, assume an article is at 
`source/_patterns/04-pages/articles-/00-top-story.mustache`. Create the link as 
follows:

```
<a href="{{ link.pages-top-story }}">Article Headline</a>
```

This would built to the public directory as:

```
<a href="../04-pages-articles--00-top-story/04-pages-articles--00-top-story.html">Article Headline</a>
```

The Static Site Generator would output this as:

```
<a href="articles--top-story.html">Article Headline</a>
```

Numeric prefixes to filenames and sub-directories will be dropped. Nested 
source directories will be flattened and all static HTML files would become 
siblings. The pathing of nested folders would be retained in the filenames, so 
the organizational benefits of nesting folders will be retained.

Appending a hyphen (`-`) to the "articles" directory is just a recommended 
convention for static sites. While the Static Site Generator flattens nested 
source directories, the double-hyphen suggests that "articles" categorizes the 
more specific parts that follow.

Additional files can be put in `source/_static` so long as they do not get 
overwritten by the Static Site Generator.

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
  * These YAML files must match the source file's name with the exception of the 
    extension. 
  * The extension must be `.yml`
  * The overriding property must only contain the lowest level key:value, not 
    the entire hierarchy, e.g. only `assets_dir`, not 
    `backend.synced_dirs.assets_dir`. 
* Asset, script, and style files prefixed by "\_\_" will be ignored by 
  `fp syncback` and `fp frontend-copy`, as will files in the `_nosync` 
  directory at the root of the source directories. 

### <a id="templater"></a>Templater

Fepper's <a href="https://www.npmjs.com/package/feplet" target="_blank">Feplet</a> 
(.mustache) templates can be translated into templates compatible with your 
backend. Feplet tags just need to be replaced with tags the backend can use. 
Put these translations into YAML (.yml) files named similarly to the .mustache 
files in `source/_patterns/03-templates`. Follow 
<a href="https://github.com/electric-eloquence/fepper-drupal/blob/dev/source/_patterns/03-templates/page.yml" target="_blank">
this example</a> for the correct YAML syntax. 

Follow these rules for setting up keys and values:

* Delete the Feplet curly braces for keys.
* Trim any exterior whitespace.
* Leave other control structures and spaces within the key, e.g. !#/>^
* Wrap the key in single quotes.
* Follow the closing quote with a colon, space, pipe, the numeral 2, and a 
  newline `: |2`
* Indent each line of the value by at least two spaces.

Run `fp syncback` or `fp template`. 

* Be sure that `backend.synced_dirs.templates_dir` and 
  `backend.synced_dirs.templates_ext` are set in `pref.yml`. 
* The default `templates_dir` and `templates_ext` settings in `pref.yml` can be 
  overridden by similarly named settings in the template-specific YAML files. 
* Templates prefixed by "\_\_" will be ignored by the Templater as will files in 
  the `_nosync` directory. 
* The Templater will recurse through nested Feplet templates if the tags are 
  written in the full relative path syntax and have the `.mustache` extension, 
  e.g. `{{> 02-components/00-global/00-header.mustache }}` 
* However, the more common inclusion use-case is to leave off the extension, and 
  not recurse. 

<p><a href="https://github.com/electric-eloquence/fepper-drupal" target="_blank">
Fepper for Drupal</a> and 
<a href="https://github.com/electric-eloquence/fepper-wordpress" target="_blank">
Fepper for WordPress</a> have working examples of templates compatible with the 
Templater.</p>

### <a id="webserved-directories"></a>Webserved Directories

When using a backend, assets generally need to be shared with the Fepper 
frontend. The `syncback` and `frontend-copy` tasks copy files from Fepper to the 
backend, but not the other way. Instead of providing a task to copy in the 
reverse direction, Fepper serves backend files if their directories are entered 
into the `webserved_dirs` block in `pref.yml`. Be sure these values are 
formatted as YAML array elements.

> WEBSERVED DIRECTORIES ARE FOR STATIC ASSETS ONLY! DO NOT WEBSERVE DIRECTORIES 
  WITH BACKEND SOURCE CODE! NO BACKEND PROGRAMMING LANGUAGE WILL GET 
  PREPROCESSED! IF A STATIC SITE IS GENERATED, OR THE EXPRESS APP PUBLICLY 
  SERVED, SOURCE CODE WILL BE RENDERED AS PLAIN TEXT! THIS WILL MAKE PUBLIC ANY 
  SENSITIVE INFORMATION CONTAINED WITHIN!

### <a id="html-scraper"></a>HTML Scraper

Fepper can scrape and import the HTML of any valid web page into a reusable 
pattern. A common use-case is to scrape pages from a backend populated with CMS 
content in order to auto-generate data files, and to replicate the CMS's HTML 
structure. To open the Scraper, click Scrape in the Fepper UI, and then click 
HTML Scraper. Enter the URL of the page you wish to scrape. Then, enter the CSS 
selector you wish to target (prepended with "#" for IDs and "." for classes). 
Classnames and tagnames may be appended with array index notation (`[n]`). 
Otherwise, the Scraper will scrape all elements of that class or tag 
sequentially. Such a loosely targeted scrape will save many of the targeted 
fields to a JSON file, but will only save the first instance of the target to a 
Feplet (.mustache) file.

Upon submission, you should be able to review the scraped output on the 
subsequent page. If the output looks correct, enter a filename and submit again. 
The Scraper will save .mustache and .json files by that name in the 98-scrape 
directory, also viewable under the Scrape menu of the toolbar. The Scraper will 
also correctly indent the Feplet code.

### <a id="variables.styl"></a>variables.styl

`source/_scripts/src/variables.styl` is a file containing variables that can 
be shared across the Stylus CSS preprocessor, browser JavaScripts, and PHP 
backends (and possibly other language backends as well). It ships with these 
values:

```
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
processors and tries to keep the amount of npms to download to a minimum. 
However, since Stylus allows for this easy sharing of variables, most Fepper 
distros ship with the 
<a href="https://www.npmjs.com/package/fp-stylus" target="_blank">fp-stylus</a> 
extension and a fully-populated `source/_styles/src/stylus` directory. The 
Stylus files are written in the terse, YAML-like, indentation-based syntax. 
However, the more verbose, CSS-like syntax (with curly braces and semi-colons) 
is perfectly valid as well.

The UI's viewport resizer buttons are dependent on the values in 
`variables.styl`. The default values will configure the XX, XS, SM, and MD 
buttons to resize the viewport to each breakpoint's assigned maximum width. The 
LG button will resize the viewport to a width that is greater than `bp_md_max` 
by the distance between `bp_sm_max` and `bp_md_max`.

Users have the ability to add, modify, or delete values in `variables.styl`. The 
UI will respect these changes; but keep in mind that additions must be prefixed 
by `bp_` and suffixed by `_max` in order for them to appear as viewport resizer 
buttons. A `-1` value translates to `Number.MAX_SAFE_INTEGER`, and effectively 
means infinity.

### <a id="ui-customization"></a>UI Customization

All aspects of the UI are available for customization. For example, the toolbar 
can accept additions, modifications, and deletions per the needs of end-users. 
The UI markup is compiled by recursive, functional React calls. The recursion 
tree is reflected by the directory structure containing the modules which 
compose the UI. To override any given module, copy the directory structure 
leading to the module from 
<a href="https://github.com/electric-eloquence/fepper-npm/tree/dev/ui/core/styleguide/index/html" target="_blank">
https&colon;//github.com/electric-eloquence/fepper-npm/tree/dev/ui/core/styleguide/index/html</a> 
to `source/_ui/index/html`, respective to your implementation. Modifications to 
modules in that directory will override the corresponding modules in core. 
Additions (so long as they are correctly nested) will also be recognized.

A working example of UI customization can be found at 
<a href="https://github.com/electric-eloquence/fepper-drupal/blob/dev/source/_ui/index/html/00-head/head.component.js" target="_blank">
https&colon;//github.com/electric-eloquence/fepper-drupal/blob/dev/source/_ui/index/html/00-head/head.component.js</a>. 
The Fepper for Drupal project overrides its HTML title to read "Fepper for 
Drupal" instead of "Fepper". In order to do so, it has the `head.component.js` 
module nested in directories that correspond to the tags that nest the `head` 
HTML element. Both `head.component.js` and its nesting directories must be named 
similarly to their corresponding elements. `.component.js` indicates that the 
file is a module to be rendered by React. 
<a href="https://reactjs.org/docs/dom-elements.html" target="_blank">
It must export properties that `React.createElement()` understands</a>. 
The numeric prefix to `00-head` orders it to precede `01-foot`, even though 
"foot" precedes "head" alphabetically.

In this example, by allowing customizations in the `00-head` directory separate 
from the core components, core updates will be respected for all components 
except for the HTML head.

Browser JavaScript and CSS customizations can (and should) be componentized 
this way as well. While a head element is unlikely to have associated scripts or 
styles, the UI's main element does have its scripts and styles componentized as 
<a href="https://github.com/electric-eloquence/fepper-npm/tree/dev/ui/core/styleguide/index/html/01-body/40-main" target="_blank">
`main.js` and `main.css` in `index/html/01-body/40-main`</a>. A big advantage 
for this type of componentization comes when elements are renamed or deleted. 
When you rename or delete the element, are you _absolutely_ sure you'll rename 
or delete accordingly in some far-flung, monolithic script or style file?

Alas, no one should be _forced_ to componentize this way. Generic modifications 
to UI scripts can be added to `source/_scripts/ui-extender.js`.

Similarly, generic modifications to UI styles can be added to 
`source/_styles/pattern-scaffolding.css`. (The file is named this way to adhere 
to the Pattern Lab convention on defining pattern states. It should not be 
relied on for pattern scaffolding.)

View All markup can also be overridden by copying the .mustache files in 
<a href="https://github.com/electric-eloquence/fepper-npm/tree/dev/ui/core/styleguide/viewall" target="_blank">
https&colon;//github.com/electric-eloquence/fepper-npm/tree/dev/ui/core/styleguide/viewall</a> 
and pasting them to `source/_ui/viewall` (nested correctly). Modifications will 
then be recognized and displayed in the UI. (No additions are allowed.) Custom 
View All styles can be added to `source/_styles/pattern-scaffolding.css`.

You will need to compile the UI in order for the browser to pick up custom 
changes to the UI:

```
fp ui:compile
```

New UI customizations will not be picked up simply by restarting Fepper.

The UI exposes these additional tasks:

* `fp ui:build` - Build the patterns and output them to the public directory
* `fp ui:clean` - Delete all patterns in the public directory
* `fp ui:compile` - Compile the Fepper User Interface from its components
* `fp ui:copy` - Copy frontend files (\_assets, \_scripts, \_styles) to the 
  public directory
* `fp ui:copy-styles` - Copy \_styles to the public directory (for injection 
  into the browser without a refresh)
* `fp ui:help` - Get more information about Fepper UI CLI commands

### <a id="extensions"></a>Extensions

The `extend` directory is purposed for extending Fepper's functionality. 
Extensions can be contributed or custom. The `extend` directory will not be 
modified when updating Fepper.

##### Contributed extensions:

* Install and update contributed extensions with npm in the `extend` directory.
* Add the tasks to `extend/contrib.js` (and `extend/auxiliary/auxiliary_contrib.js` 
  if necessary) in order for Fepper to run them.
* Contributed Fepper extensions can be found at 
  <a href="https://www.npmjs.com/search?q=fepper%20extension" target="_blank">
  https://www.npmjs.com/search?q=fepper%20extension</a>

##### Custom extensions:

* Write custom extensions in the `extend/custom` directory.
* Extensions require a file ending in "~extend.js" in order for Fepper to 
  recognize their tasks.
* The "\*~extend.js" file can be directly under `extend/custom`, or nested one 
  directory deep, but no deeper.
* Add the tasks to `extend/custom.js` (and `extend/auxiliary/auxiliary_custom.js` 
  if necessary) in order for Fepper to run them.
* Fepper runs a self-contained instance of gulp to manage tasks. This gulp 
  instance will be independent of any other gulp instance on your system.
* For best results, set `const gulp = global.gulp`, not 
  `const gulp = require('gulp')`.
* The `fp` command is an alias for `gulp` (among other things). Any `fp` task 
  can be included in a custom task.
* Fepper only supports 
  <a href="https://github.com/electric-eloquence/gulp#readme" target="_blank">gulp 3</a> 
  syntax.

It may be helpful to write help text for a custom extension, especially when a 
person other than the author uses it. To do this, create a custom task appended 
by ":help".  Declare and log the help text as follows, and it will be output by 
running `fp extend:help`.

```
'use strict';

const gulp = global.gulp;

gulp.task('custom-task:help', function (cb) {
  let helpText = `
Fepper Custom Task Extension

Usage:
    <task> [<additional args>...]

Task and description:
    fp custom-task:help    Print usage and description of custom task.
`;

  console.log(helpText);
  cb();
});
```

##### Confs and prefs:

You might need to access the values in the `conf.yml` and `pref.yml` files in 
order to write custom tasks. They are exposed through `global.conf` and 
`global.pref` (on the `global` Node object).

The values in `patternlab-config.json` are exposed through `global.conf.ui`. 
Please note that all paths in `patternlab-config.json` will be converted to 
absolute paths in `global.conf.ui`. Relative paths can be accessed through 
`global.conf.ui.pathsRelative`.

##### Utilities:

Common utilty functions for custom extensions are available from the
<a href="https://www.npmjs.com/package/fepper-utils" target="_blank">Fepper Utils</a>
npm.

##### Object-oriented Fepper:

Beneath the gulp tasking system lies object-oriented Fepper. Running any `fp` 
task instantiates the `Fepper` class. This instance is exposed through the 
`global.fepper` object. By directly accessing the `Fepper` instance, you can run 
any Fepper operation without gulp. Deeper within `Fepper` lies the `Patternlab` 
class. By directly accessing `Patternlab`, you can run any Pattern Lab 
operation without Fepper. The `Patternlab` instance is attached to Fepper as 
`global.fepper.ui.patternlab`. The `global.fepper` object can, of course, be 
easily inspected in a console.

If there is something you wish were different about the `Fepper` class, or any 
of its member classes, you can inherit from the class, and make whatever changes 
you wish, without worry that your changes will be overwritten by the next 
update.

Here is an example of overriding the `fp help` command:

1. Create an `instance_file`. For this example, let's write it at 
   `extend/custom/hack-help.js`.

```
'use strict';

const FepperSuper = require('fepper');
const HelperSuper = require('fepper/core/tasks/helper');
const TasksSuper = require('fepper/core/tasks/tasks');

class Helper extends HelperSuper {
  constructor(options) {
    super(options);
  }

  main() {
    console.log('ASYNC ALL THE THINGS!');
  }
}

class Tasks extends TasksSuper {
  constructor(options) {
    super(options);
    this.helper = new Helper(this.options);
  }
}

module.exports = class Fepper extends FepperSuper {
  constructor(cwd) {
    super(cwd);
    this.tasks = new Tasks(this.options);
  }
}
```

2. Declare `instance_file` in `pref.yml`.

```
instance_file: extend/custom/hack-help.js
```

3. Run `fp help` on the command line. It should log 
   <a href="https://www.npmjs.com/package/gulp4-run-sequence#why-the-culinary-task-names" target="_blank">
   "ASYNC ALL THE THINGS!"</a>

Hackers wishing to view the code for any of these classes will find that the ES6 
syntax and object-orientation makes the code mostly self-documenting. The entry 
point to the `Fepper` class is in 
<a href="https://github.com/electric-eloquence/fepper-npm/blob/dev/core/fepper.js" target="_blank">
Fepper NPM at `core/fepper.js`</a>.

There is currently no public API for object-oriented Fepper. To express demand 
for one, 
<a href="https://github.com/electric-eloquence/fepper/issues" target="_blank">
please open an issue</a>.

### <a id="express-app"></a>Express App

Fepper exposes its <a href="https://expressjs.com/" target="_blank">Express</a> 
application through the `global.expressApp` object. This object can be 
overridden with custom routes and middleware via the `custom:tcp-ip` (or 
`contrib:tcp-ip`) extension task. Initialization of `global.expressApp` occurs 
before this task, and listening occurs afterward.

`global.expressApp` is a direct reference to `global.fepper.tcpIp.fpExpress.app`.

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

### <a id="i18n"></a>I18N

The Elements, Compounds, and Components directories are optional and can be 
renamed to anything your charset and file system allow without further 
configuration, so long as there are no collisions with other names. The 
Templates, Pages, and Scrape directories allow for similar renaming but they 
must be configured in `patternlab-config.json`.

The text in the UI, as well as console messages, can be changed by editing 
`source/_ui/i18n/en.json`. Replace the blank values with alternate English 
values if you wish. If you want translation to another language, create a new 
file named by the abbreviation for the language. For example: 
`source/_ui/i18n/es.json` for Spanish. Then, assign that abbreviation to the 
`lang` key in `pref.yml`. In the .json file, assign the translated values to the 
English keys.

Fepper follows a popular convention of naming the translation function `t`. (See 
<a href="https://github.com/i18next/i18next" target="_blank">i18next</a> and 
<a href="https://github.com/i18next/react-i18next" target="_blank">react-i18next</a> 
as other examples.) Be sure never to redefine the `global.t` variable.

If a need arises for documentation in other languages, you are strongly 
encouraged to make the translations, and use the options that Open Source offers 
to distribute them to the rest of the world.

### <a id="keyboard-shortcuts"></a>Keyboard Shortcuts

* **ctrl+alt+0**: set the viewport to "extra extra small"
* **ctrl+shift+x**: set the viewport to "extra small"
* **ctrl+shift+s**: set the viewport to "small"
* **ctrl+shift+m**: set the viewport to "medium"
* **ctrl+shift+l**: set the viewport to "large"
* **ctrl+alt+w**: set the viewport to "whole"
* **ctrl+alt+r**: set the viewport to a random width
* **ctrl+alt+g**: start/stop "grow" animation
* **ctrl+shift+a**: open/close Annotations Viewer
* **ctrl+shift+c**: open/close Code Viewer
* **ctrl+shift+]**: select next tab/panel in Code Viewer
* **ctrl+shift+[**: select previous tab/panel in Code Viewer
* **ctrl+alt+h**: dock Code Viewer to the left
* **ctrl+alt+j**: dock Code Viewer to the bottom
* **ctrl+alt+l**: dock Code Viewer to the right
* **ctrl+shift+f**: open/close the Pattern Search

As a reminder, the viewport sizes can be customized in `source/_scripts/src/variables.styl`.

### <a id="more-documentation"></a>More Documentation

* <a href="https://fepper.io/docpage" target="_blank">Fepper website</a>
* <a href="https://github.com/electric-eloquence/fepper-npm/blob/dev/excludes/pref.yml" target="_blank">
  Default pref.yml</a>
* <a href="https://www.npmjs.com/package/feplet" target="_blank">Feplet</a> 
* <a href="https://www.npmjs.com/package/fepper-utils" target="_blank">Fepper Utils</a>
* <a href="https://mustache.github.io/mustache.5.html" target="_blank">
  Mustache</a>

[snyk-image]: https://snyk.io//test/github/electric-eloquence/fepper/master/badge.svg
[snyk-url]: https://snyk.io//test/github/electric-eloquence/fepper/master

[linux-image]: https://github.com/electric-eloquence/fepper/workflows/Linux%20build/badge.svg?branch=master
[linux-url]: https://github.com/electric-eloquence/fepper/actions?query=workflow%3A"Linux+build"

[mac-image]: https://github.com/electric-eloquence/fepper/workflows/Mac%20build/badge.svg?branch=master
[mac-url]: https://github.com/electric-eloquence/fepper/actions?query=workflow%3A"Mac+build"

[windows-image]: https://github.com/electric-eloquence/fepper/workflows/Windows%20build/badge.svg?branch=master
[windows-url]: https://github.com/electric-eloquence/fepper/actions?query=workflow%3A"Windows+build"

[node-version-image]: https://img.shields.io/node/v/fepper.svg

[license-image]: https://img.shields.io/github/license/electric-eloquence/fepper.svg
[license-url]: https://raw.githubusercontent.com/electric-eloquence/fepper/master/LICENSE
