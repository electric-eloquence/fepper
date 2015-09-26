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
  * On a Mac: `brew install node`
  * If already installed, be sure the version is up to date: `node -v`
  * Update if necessary: `brew update && brew upgrade node`
  * If not on a Mac, and not using Homebrew:
[https://github.com/joyent/node/wiki/installing-node.js-via-package-manager](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager)
* On Mac OS X:
  * Double-click `fepper.command`
* On other OSs (or if you prefer the command line):
  * `npm install`
* After successful installation:
  * Double-click `fepper.command` again
  * Or enter `node .` on the command line.
* Open [http://localhost:3000](http://localhost:3000) in a browser if it doesn't open automatically.

###Configuration###

Edit `conf.yml` for customizing local settings and for general configuration 
information. If you wish to use the `syncback`, `frontend-copy`, or `template` 
tasks, you must supply values for the `backend.synced_dirs` configs in order for 
those directories to get processed and copied to the backend.

You may edit `patternlab-node/source/_data/_data.json` to globally populate 
Mustache templates with data. Underscore-prefixed .json files within 
`source/_patterns` will be concatenated to the output of \_data.json, the whole 
in turn getting compiled into data.json, the final source of globally scoped 
data. Manual edits to data.json will get overwritten on compilation.

When upgrading Fepper, be sure to back up the patternlab-node/source directory. 
This is where all custom work is to be done.

If using Git for version control, directories named "ignore" will be ignored.

###Utilization###

* To launch from Mac OS X Finder:
  * Double-click `fepper.command`
* To launch from the command line:
  * `node .`
* These other utility tasks are runnable on the command line:
  * `node . data` to force compile data.json.
  * `node . frontend-copy` to copy css, fonts, images, and js to backend.
  * `node . lint` to lint JavaScripts, JSON, and HTML.
  * `node . minify` to minify JavaScripts.
  * `node . once` to clean the public folder and do a one-off Fepper build.
  * `node . publish` to publish the public folder to GitHub Pages.
  * `node . static` to generate a static site from the 04-pages directory.
  * `node . syncback` combines lint, minify, frontend-copy, and template.
  * `node . template` translates templates for backend and copies them there.

###Static Site Generation###
Running `node . static` will generate a complete static site based on the files 
in `patternlab-node/source/_patterns/04-pages`. The site will be viewable at
[http://localhost:3000/static/](http://localhost:3000/static/). An `index.html` 
will be generated based on the `00-homepage.mustache` file. If the links are 
relative and they work correctly in the Pattern Lab UI, they will work correctly 
in the static site even if the `static` directory is moved and renamed. The only 
caveat is that links to other pages in the `patterns` directory must start with 
`../04-pages-` and not `../../patterns/04-pages-`.

###The Backend###
Fepper can just as easily work with a CMS backend such as WordPress or Drupal, 
while not requiring Apache, MySQL, or PHP. Put the actual backend codebase or 
even just a symbolic link to the codebase into the `backend` directory. Then, 
enter the relative paths to the appropriate backend directories into `conf.yml`. 
(Do not include "backend" or a leading slash.) You will then be able to run 
`node . syncback`, `node . frontend-copy`, or `node . template` to export your 
frontend data into your backend web application.

###Webserved Directories###
When using a CMS backend, assets generally need to be shared with the Fepper 
frontend. The `syncback` and `frontend-copy` tasks copy files from Fepper to the 
backend, but not the other way. Instead of providing a task to copy in the 
reverse direction, Fepper serves backend files if their directories are entered 
into the `webserved_dirs` block in conf.yml.

```
DO NOT INCLUDE DIRECTORIES WITH SOURCE CODE! GITHUB PAGES AND MANY OTHER PUBLIC 
HOSTS DO NOT PREPROCESS PHP AND OTHER PROGRAMMING LANGUAGES, SO ANY PUBLISHED 
SOURCE CODE WILL BE RENDERED AS PLAIN TEXT! THIS WILL MAKE PUBLIC ANY SENSITIVE 
INFORMATION CONTAINED WITHIN THE SOURCE CODE!
```

###GitHub Pages###
If you have checked Fepper into a repository in your GitHub account, you may run 
`node . publish` to publish `patternlab-node/public` to GitHub pages. The 
Pattern Lab UI and Fepper static files will then be viewable from the Web at 
`http://user.github.io/repo/`. Normally, this is all that is needed. However, if 
you are using `webserved_dirs`, you will need to supply a `gh_pages_prefix` 
config in `conf.yml` or `patternlab-node/source/_data/_data.json`. This config 
needs to be set to the name of your GitHub repository and must contain a leading 
slash. Setting `gh_pages_prefix` in `_data.json` will save that value in version 
control. If `gh_pages_prefix` is set in both `conf.yml` and `_data.json`, the 
value in `conf.yml` will take priority.

###Templater###
Pattern Lab's Mustache templates can be translated into templates compatible 
with your backend CMS. Mustache tags just need to be replaced with tags the CMS 
can use. Put these translations into YAML files named similarly to the Mustache 
files in `patternlab-node/source/_patterns/03-templates`. Follow the example in 
`test/patterns/03-templates/00-homepage.yml` for the correct YAML syntax. 
Templates prefixed by "__" will be ignored by the templater as will files in the 
`_nosync` directory. Be sure that `backend.synced_dirs.templates_dir` and 
`backend.synced_dirs.templates_ext` are set in `conf.yml`. Run `node . syncback` 
or `node . template` to execute the templater.

###More Documentation###

* [default.conf.yml](https://github.com/electric-eloquence/fepper/blob/master/default.conf.yml)
* [Pattern Lab](http://patternlab.io/docs/index.html)
* [Mustache](https://mustache.github.io/mustache.5.html)

###Contributing###

Contributions and bug fixes are greatly appreciated!

* Please pull request against the [dev branch](https://github.com/electric-eloquence/fepper/tree/dev).
* Please try to be both concise as well as clear on what is trying to be accomplished.
