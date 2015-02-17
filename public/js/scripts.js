'use strict';
/* jshint undef: false*/

var toggledisplay = function(elementID) {
  (function(style) {
     style.display = style.display === 'none' ? '' : 'none';
  })(document.getElementById(elementID).style);
};
