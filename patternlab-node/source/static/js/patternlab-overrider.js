(function () {
  'use strict';

  var i;
  var FEPPER = window.FEPPER;
  var pd = parent.document;
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
    pd.getElementById('sg-gen-container').className = 'vp-animate';
    pd.getElementById('sg-gen-container').style.width = theSize + viewportResizeHandleWidth + 'px';
    // Resize viewport to desired size.
    pd.getElementById('sg-viewport').className = 'vp-animate';
    pd.getElementById('sg-viewport').style.width = theSize + 'px';
   
    var targetOrigin = (window.location.protocol === 'file:') ? '*' : window.location.protocol+'//'+window.location.host;
    var obj = JSON.stringify({'resize': 'true'});
    pd.getElementById('sg-viewport').contentWindow.postMessage(obj,targetOrigin);

    // Update values in toolbar
    updateSizeReading(theSize);
    // Save current viewport to cookie
    saveSize(theSize);
  }

  function updateSizeReading(size) {
    var bodyFontSize;
    if (pd.getElementsByTagName('body')[0].style.fontSize.indexOf('px') !== -1) {
      bodyFontSize = parseInt(pd.getElementsByTagName('body')[0].style.fontSize.replace('px', ''), 10);
    }
    else {
      bodyFontSize = 16;
    }
      
    var pxSize = size;
    var emSize = size / bodyFontSize;
    //Px size input element in toolbar
    var sizePx = pd.getElementsByClassName('sg-size-px')[0];
    //Em size input element in toolbar
    var sizeEms = pd.getElementsByClassName('sg-size-em')[0];
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
  // the lg, md, and sm breakpoints. Also, converting rem to px, since Pattern
  // Lab's resizer only works with px and em.
  var minWidthL = bps.lg.minWidth * 10;
  var minWidthM = bps.md.minWidth * 10;
  median = (minWidthL - minWidthM) / 2;
  bpObj.l = minWidthL + median;
  bpObj.m = minWidthM + median;
  bpObj.s = minWidthM - median;

  // Iterate through bps in order create event listeners that resize the viewport.
  for (i in bpObj) {
    if (bpObj.hasOwnProperty(i)) {
      // Stripping breakpoint buttons of original event listeners.
      bpBtn = pd.getElementById('sg-size-' + i);
      if (bpBtn) {
        bpBtnClone = bpBtn.cloneNode(true);
        bpBtn.parentNode.replaceChild(bpBtnClone, bpBtn);

        // Re-adding click event listener.
        bpBtn = pd.getElementById('sg-size-' + i);
        bpBtn.addEventListener('click', function (event) {
          event.preventDefault();
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

  //////////////////////////////////////////////////////////////////////////////
  /// MUSTACHE CODE BROWSER
  //////////////////////////////////////////////////////////////////////////////
  var codeFill = pd.getElementById('sg-code-fill');
  if (codeFill) {
    // Give the PL Mustache code viewer the appearance of being linked.
    codeFill.addEventListener('mouseover', function () {
      this.style.cursor = 'pointer';
    });
    // Send to Fepper's Mustache browser when clicking the viewer's Mustache code.
    codeFill.addEventListener('click', function (event) {
      var code = encodeURIComponent(this.innerHTML);
      var title = pd.getElementById('title').innerHTML.replace('Pattern Lab - ', '');
      window.location = window.location.origin + '/mustache-browser/?title=' + title + '&code=' + code;
      return false;
    });
  }

})();
