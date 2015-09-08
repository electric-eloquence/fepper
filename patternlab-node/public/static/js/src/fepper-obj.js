/**
 * Create this namespaced object as a member of the window object so it can be
 * be a source of properties and functions in all following JavaScripts.
 */
var FEPPER = {};
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
