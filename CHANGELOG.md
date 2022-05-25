# Fepper Changelog

### v0.17.1
* Added keyboard shortcuts to dock the code/annotations viewer
* Added keyboard shortcuts to switch between tabs/panels in code viewer
* Annotations viewer persists when viewed in halfMode

### v0.17.0
* Code Viewer added dock-left and dock-right options
* Mustache Browser no longer opens in main panel of UI
* Mustache Browser reloads pattern in main panel of UI when following linked partials
* Markdown can be viewed in Code Viewer
* Markdown can be edited in Code Viewer
* Code Viewer can interface with Git when editing Markdown

### v0.16.0
* Copying data.json to public directory
* Fetching success page branding image from fepper.io
* Backward compatibility for escaped templater YAML
* Support for Markdown content
* Static Site Generator uses defaultPattern config to determine index.html
* Better data inheritance by pseudo-patterns

### v0.15.2
* Updated UI toolbar with more relevant link to Fepper docs

### v0.15.1
* Removed need to escape reserved regexp chars in templater yaml keys

### v0.15.0
* Improved UI javascript
* Improved simple success page
* Showing pattern states for pseudo-patterns
* Showing pattern states in more places
* Code viewer and mustache browser have widgets for copying path
* HTML scraper scrapes pages after running their javascript
* Removing file and directory numeric prefixes when generating static site html files

### v0.14.1
* Patterns opened in new tab outside Fepper UI do not call Fepper UI JavaScript
* Updated appendixer to account for variables.styl strings wrapped in quotes
* Improvements to mobile nav toggles in demo site

### v0.14.0
* Loading pref before conf to define the i18n lang earlier
* More and better i18n
* Removed deprecated conf.backend\_dir
* Allowing empty object in \_data/\_data.json
* Fixed manual viewport resizer in Firefox
* Style updates to demo site

### v0.13.5
* Removed livereloading of images and other assets from Windows
* Updated icon fonts

### v0.13.4
* Livereloading of images and other assets
* Added i18n for all user-facing text

### v0.13.3
* Bumped gulp and fepper dependency versions

### v0.13.2
* Bumped gulp version

### v0.13.1
* Keeping original template whitespacing for output to .mustache file
* Better z-indexing of UI
* Fixed writing of patterns if cleanPublic true
* Fixed livereloading of .mustache updates
* Switched from xxhash to md4 for non-cryptographic hashing

### v0.13.0
* Major performance improvements
* Switched viewall rendering from server to client
* Hashing pattern bodies so they don't need to get rewritten if unchanged
* Removed whitespace from pattern bodies before templating which improves performance

### v0.12.1
* Dependency updates which incorporate many bug fixes and code improvements

### v0.12.0
* Limiting support to Node 12
* Node infrastructure set up for Fepper UI with ES6 modules, state management, and more modernization
* More complete help tasks

### v0.11.2
* Ready for Node 12
* Bumped Node version in Node installer to v10.15.3
* Dependency updates

### v0.11.1
* Bumped Node version in Node installer to v8.15.1
* .eslintrc.json in current working directory set to lint client-side js

### v0.11.0
* Exposing instance\_file preference for subclassing Fepper class
* Fixed HTML for viewalls
* Added default gulpfile.js for running `gulp` command instead of `fp`

### v0.10.3
* Dependency updates
* Added text color highlights to console log messages

### v0.10.2
* Bumped some dependencies to new minor versions
* Better frontend-copier logic for non-existent backend directory

### v0.10.1
* Moving dependencies from distro to fepper-npm
* Improved HTML beautification
* Improved Windows scripting

### v0.10.0
* Readme links to gist explaining gpg verification

### v0.9.2
* More vigorous continuous integration testing
* Better font support across platforms for Express-served pages
* Fixed curly braces in html output for readme and success pages
* `fp update` gets direct downloads from distro repo
* Removed target="\_blank" from html scraper
* More helpful missing pattern error message

### v0.9.1
* Updating to more secure dependencies

### v0.9.0
* `fp update` updates fepper-cli even when behind a major version
* 404 page
* Better hiding of excluded patterns
* Fepper Express app using Feplet instead of string replace
