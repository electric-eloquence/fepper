/* eslint-disable no-console */
import * as assert from 'assert';
import * as fs from 'fs';
import {createRequire} from 'module';
import * as path from 'path';
import {fileURLToPath} from 'url';

import {JSDOM} from 'jsdom';
import * as Redux from 'redux';
import Requerio from 'requerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const html = fs.readFileSync(
  path.join(__dirname, '..', 'patterns', '04-pages-01-project-leads', '04-pages-01-project-leads.html'),
  'utf8'
);
const {window} = new JSDOM(html);

global.Redux = Redux;
global.Requerio = Requerio;
global.window = window;
global.document = window.document;
global.$ = require('jquery');

const requerioApp = require('../_scripts/src/requerio-app.cjs');
const requerio = window.requerio;

/* Expect clicking the submenu toggle to activate and deactivate the submenu. */
console.log('Expect clicking the submenu toggle to activate and deactivate the submenu.');

const navSubmenuContainerClassArray0 = requerio.$orgs['#nav__submenu-container'].getState().classArray;

requerio.$orgs['#nav__submenu-toggle'].click();

const navSubmenuContainerClassArray1 = requerio.$orgs['#nav__submenu-container'].getState().classArray;

requerio.$orgs['#nav__submenu-toggle'].click();

const navSubmenuContainerClassArray2 = requerio.$orgs['#nav__submenu-container'].getState().classArray;

assert.deepStrictEqual(navSubmenuContainerClassArray0, ['nav__menu__item', 'nav__submenu-container']);
assert.deepStrictEqual(navSubmenuContainerClassArray1, ['nav__menu__item', 'nav__submenu-container', 'active']);
assert.deepStrictEqual(navSubmenuContainerClassArray2, ['nav__menu__item', 'nav__submenu-container']);

console.log('Passed.');
console.log();

/* Expect clicking the sidebar toggle for small viewports to activate and deactivate the sidebar. */
console.log('Expect clicking the sidebar toggle for small viewports to activate and deactivate the sidebar.');

const navClassArray0 = requerio.$orgs['#nav'].getState().classArray;
const sidebarToggleClassArray0 = requerio.$orgs['#sidebar-toggle-for-small-vp'].getState().classArray;

requerio.$orgs['#sidebar-toggle-for-small-vp'].click();

const navClassArray1 = requerio.$orgs['#nav'].getState().classArray;
const sidebarToggleClassArray1 = requerio.$orgs['#sidebar-toggle-for-small-vp'].getState().classArray;

requerio.$orgs['#sidebar-toggle-for-small-vp'].click();

const navClassArray2 = requerio.$orgs['#nav'].getState().classArray;
const sidebarToggleClassArray2 = requerio.$orgs['#sidebar-toggle-for-small-vp'].getState().classArray;

assert.deepStrictEqual(navClassArray0, ['nav']);
assert.deepStrictEqual(navClassArray1, ['nav', 'active']);
assert.deepStrictEqual(navClassArray2, ['nav']);

assert.deepStrictEqual(sidebarToggleClassArray0, ['sidebar-toggle-for-small-vp']);
assert.deepStrictEqual(sidebarToggleClassArray1, ['sidebar-toggle-for-small-vp', 'active']);
assert.deepStrictEqual(sidebarToggleClassArray2, ['sidebar-toggle-for-small-vp']);

console.log('Passed.');
console.log();
