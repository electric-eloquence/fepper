(function () {
  'use strict';

  window.toggleHelp = function () {

    var button = document.getElementById("help-button");
    var text = document.getElementById("help-text");

    if (button.innerHTML === "Help") {
      button.innerHTML = "Hide";
      text.style.visibility = "visible";
    }
    else {
      button.innerHTML = "Help";
      text.style.visibility = "hidden";
    }

    return false;
  };
})();
