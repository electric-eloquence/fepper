Fepper
======

A frontend prototyper for streamlining website design and development

###Installation###

* On Mac OS X:
  * Install Homebrew [http://brew.sh](http://brew.sh)
* On other Unix-like OSs:
  * Permissions might need to be reworked after globally installing NPMs.
  * Global Node modules and their executables are generally written to root-owned directories, so NPM commands with the -g option might need to be run as root.
  * However, this sometimes writes root-owned files into $HOME/.npm which needs to be owned entirely by the standard user.
  * If this is the case, be sure to recursively chown $HOME/.npm with the standard user's ownership.
* On non-Unix-like OSs:
  * Sorry, but Fepper is not supported on non-Unix-like OSs.
* Install Node.js and NPM (Node Package Manager).
  * Requires Node.js v4.0.0 at the very least.
  * On Mac: `brew install node`
  * If already installed, be sure the version is up to date: `brew update && brew upgrade node`
  * If not on a Mac, and not using Homebrew:
[https://github.com/joyent/node/wiki/installing-node.js-via-package-manager](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager)
* On Mac OS X:
  * Double-click fepper.command
* On other OSs (or if you prefer the command line):
  * `npm install`
* Open http://localhost:3000 in a browser if it doesn't open automatically.

###Configuration###

Edit conf.yml for customizing local settings and for general configuration
information.

After installation, you may edit patternlab-node/source/\_data/\_data.json to
globally populate Mustache templates with data. Underscore-prefixed .json files
within source/\_patterns will be concatenated to the output of \_data.json, the
whole in turn getting compiled into data.json, the final source of globally
scoped data. Manual edits to data.json will get overwritten on compilation.

When upgrading Fepper, be sure to back up the patternlab-node/source directory.
This is where all custom work is to be done.

If using Git for version control, directories named "ignore" will be ignored.

###Utilization###

The following are the terminal commands for Fepper:

* `node .` to launch Fepper from the command line.
* `node . data` to force compile \_data.json.
* `node . frontend-copy` to copy css, fonts, images, js, and templates to backend.
* `node . lint` to lint JavaScripts, JSON, and HTML.
* `node . once` to clean the public folder and do a one-off Fepper build.
* `node . publish` to publish the public folder to GitHub Pages.
* `node . static` to generate a static site from the 04-pages directory.
* `node . syncback` to lint, uglify and copy Fepper frontend files to the backend.

###Documentation###

The following READMEs are also invaluable for documentation:

* [patternlab-node/README.md](https://github.com/electric-eloquence/fepper/blob/master/patternlab-node/README.md)
* [backend/README](https://github.com/electric-eloquence/fepper/blob/master/backend/README)
* [\_source/static/README](https://github.com/electric-eloquence/fepper/blob/master/_source/static/README)

###Contributing###

Contributions and bug fixes are greatly appreciated!

* Please pull request against the [dev branch](https://github.com/electric-eloquence/fepper/tree/dev).
* Please try to be both concise as well as clear on what is trying to be accomplished.
