# Extensions
A Stylus CSS preprocessing extension is included with Fepper. In order to enable 
it, run `npm install` in this directory. Then, uncomment the `css-process` tasks 
in `custom.js`.

### Contributed extensions
* Install and update contributed extensions with NPM.
* Add the tasks to `contrib.js` (and `auxiliary/auxiliary_contrib.js` if necessary) in order for Fepper to run them.

### Custom extensions
* Write custom extensions within an appropriately named directory just under the `custom` directory.
* They must include a file ending in "~extend.js" in order for Fepper to recognize their tasks.
* Add the tasks to `custom.js` (and `auxiliary/auxiliary_custom.js` if necessary) in order for Fepper to run them.
