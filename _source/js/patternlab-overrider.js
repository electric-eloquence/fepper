(function () {
  'use strict';

  var i;
  var FEPPER = window.FEPPER;
  var d = document;
  var $ = jQuery; // Needed for DataSaver. Try to avoid jQuery in custom code.

  //////////////////////////////////////////////////////////////////////////////
  /// VIEWPORT RESIZER
  //////////////////////////////////////////////////////////////////////////////
  function sizeiframe(size) {
    var maxViewportWidth = 2600; // Defined in patternlab-node/public/js/styleguide.js
    var minViewportWidth = 240; // Defined in patternlab-node/public/js/styleguide.js
    var theSize;
    var viewportResizeHandleWidth = 14; // Defined in patternlab-node/public/js/styleguide.js
    
    if (size > maxViewportWidth) {
      // If the entered size is larger than the max allowed viewport size, cap value at max vp size.
      theSize = maxViewportWidth;
    }
    else if (size < minViewportWidth) {
      // If the entered size is less than the minimum allowed viewport size, cap value at min vp size.
      theSize = minViewportWidth;
    }
    else {
      theSize = size;
    }

    // Resize viewport wrapper to desired size + size of drag resize handler.
    d.getElementById('sg-gen-container').className = 'vp-animate';
    d.getElementById('sg-gen-container').style.width = theSize + viewportResizeHandleWidth + 'px';
    // Resize viewport to desired size.
    d.getElementById('sg-viewport').className = 'vp-animate';
    d.getElementById('sg-viewport').style.width = theSize + 'px';
   
    var targetOrigin = (window.location.protocol === 'file:') ? '*' : window.location.protocol+'//'+window.location.host;
    var obj = JSON.stringify({'resize': 'true'});
    d.getElementById('sg-viewport').contentWindow.postMessage(obj,targetOrigin);

    // Update values in toolbar
    updateSizeReading(theSize);
    // Save current viewport to cookie
    saveSize(theSize);
  }

  function updateSizeReading(size) {
    var bodyFontSize;
    if (d.getElementsByTagName('body')[0].style.fontSize.indexOf('px') !== -1) {
      bodyFontSize = parseInt(d.getElementsByTagName('body')[0].style.fontSize.replace('px', ''), 10);
    }
    else {
      bodyFontSize = 16;
    }
      
    var pxSize = size;
    var emSize = size / bodyFontSize;
    //Px size input element in toolbar
    var sizePx = d.getElementsByClassName('sg-size-px')[0];
    //Em size input element in toolbar
    var sizeEms = d.getElementsByClassName('sg-size-em')[0];
    sizeEms.value = emSize.toFixed(2);
    sizePx.value = pxSize;
  }

  function saveSize(size) {
    if (!DataSaver.findValue('vpWidth')) {
      DataSaver.addValue("vpWidth", size);
    } else {
      DataSaver.updateValue("vpWidth", size);
    }
  }

  // Replace event handlers on the S, M, and L buttons.
  var bps = FEPPER.breakpoints;
  var bpObj = {};
  var bpBtn;
  var bpBtnClone;
  var median;

  // Feel free to create more breakpoints, but Fepper only has resize buttons for
  // the lg, md, and sm breakpoints.
  var minWidthL = bps.lg.minWidth;
  var minWidthM = bps.md.minWidth;
  median = (minWidthL - minWidthM) / 2;
  bpObj.l = minWidthL + median;
  bpObj.m = minWidthM + median;
  bpObj.s = minWidthM - median;

  // Iterate through bps in order create event listeners that resize the viewport.
  for (i in bpObj) {
    if (bpObj.hasOwnProperty(i)) {
      // Stripping breakpoint buttons of original event listeners.
      bpBtn = d.getElementById('sg-size-' + i);
      if (bpBtn) {
        bpBtnClone = bpBtn.cloneNode(true);
        bpBtn.parentNode.replaceChild(bpBtnClone, bpBtn);

        // Re-adding click event listener.
        bpBtn = d.getElementById('sg-size-' + i);

        bpBtn.addEventListener('click', function (e) {
          e.preventDefault();
          var sgSize = this.id.replace('sg-size-', '');
          // Iterating again within scope of anonymous function.
          for (var j in bpObj) {
            if (sgSize === j) {
              sizeiframe(bpObj[j]);
            }
          }
        });

      }
    }
  }
})();
