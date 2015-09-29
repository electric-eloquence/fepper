/**
 * Fepper-specific namespace for browser JavaScripts.
 *
 * Create this object as a member of the window object so it can be a source of
 * properties and methods in all following browser JavaScripts. It is all caps
 * as per both Mozilla.org's standard for defining namespaces and the Node.js
 * coding standards for constants.
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript}
 * {@link https://github.com/felixge/node-style-guide}
 */
(function () {
  'use strict';

  var FEPPER = FEPPER || {};
  FEPPER.breakpoints = {
    lg: {
      maxWidth: window.bp_lg_max,
      minWidth: window.bp_lg_min
    },
    md: {
      maxWidth: window.bp_md_max,
      minWidth: window.bp_md_min
    },
    sm: {
      maxWidth: window.bp_sm_max,
      minWidth: window.bp_sm_min
    },
    xs: {
      maxWidth: window.bp_xs_max,
      minWidth: window.bp_xs_min
    }
  };
  window.FEPPER = FEPPER;
})();
