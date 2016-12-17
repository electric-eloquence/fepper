# Extensions
Fepper comes configured with a Stylus CSS preprocessing extension. It still 
needs to be installed. To do so, run `npm install` in this directory. Then, 
uncomment the `stylus` tasks in `contrib.js`.

### Contributed extensions
* Install and update contributed extensions with NPM.
* Add the tasks to `contrib.js` (and `auxiliary/auxiliary_contrib.js` if necessary) in order for Fepper to run them.

### Custom extensions
* Write custom extensions within an appropriately named directory just under the `custom` directory.
* They must include a file ending in "~extend.js" in order for Fepper to recognize their tasks.
* Add the tasks to `custom.js` (and `auxiliary/auxiliary_custom.js` if necessary) in order for Fepper to run them.
