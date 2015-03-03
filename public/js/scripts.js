'use strict';
/* jshint undef: false*/

var toggleDisplay = function(elementId) {
  var display = $('#' + elementId);

  // If display is currently visible
  if (display.is(':visible')) {
    display.hide();
  } else {
    display.show();
  }
};

var showLoadingIcon = function(str, bool) {
  var loadingIcon = $('#loadingIcon_' + str);

  if (bool) {
    loadingIcon.show();
  } else {
    loadingIcon.hide();
  }
};

$('#login_form').submit(function() {
  showLoadingIcon('login', true);
  var err = $('#error_login');
  err.hide();

  $.ajax({
    url : $('#login_form').attr('action'),
    type: $('#login_form').attr('method'),
    data: $('#login_form').serialize(),
    success: function(res) {
      var code = res.code;
      var message = res.message;

      if (res.code !== 200) {
        err.text(message);
        err.show();

        showLoadingIcon('login', false);

      } else {

        // Refresh main page
        window.location.reload();
      }

    }
  });

  // Return false so we don't submit twice
  return false;
});

$('#signup_form').submit(function() {
  showLoadingIcon('signup', true);
  var err = $('#error_signup');
  err.hide();

  $.ajax({
    url : $('#signup_form').attr('action'),
    type: $('#signup_form').attr('method'),
    data: $('#signup_form').serialize(),
    success: function(res) {
      var code = res.code;
      var message = res.message;

      if (res.code !== 200) {
        err.text(message);
        err.show();

        showLoadingIcon('signup', false);

        // Reset captcha if there is an error
        grecaptcha.reset();
      } else {

        // Refresh main page
        window.location.reload();
      }

    }
  });

  // Return false so we don't submit twice
  return false;
});

$('#createThread_form').submit(function() {
  showLoadingIcon('createThread', true);
  var err = $('#error_createThread');
  err.hide();

  $.ajax({
    url : $('#createThread_form').attr('action'),
    type: $('#createThread_form').attr('method'),
    data: $('#createThread_form').serialize(),
    success: function(res) {
      var code = res.code;
      var message = res.message;

      if (res.code !== 200) {
        err.text(message);
        err.show();

        showLoadingIcon('createThread', false);

      } else {

        // Refresh main page
        window.location.reload();
      }

    }
  });

  // Return false so we don't submit twice
  return false;
});

$('#createReply_form').submit(function() {
  showLoadingIcon('createReply', true);
  var err = $('#error_createReply');
  err.hide();

  $.ajax({
    url : $('#createReply_form').attr('action'),
    type: $('#createReply_form').attr('method'),
    data: $('#createReply_form').serialize(),
    success: function(res) {
      var code = res.code;
      var message = res.message;

      if (res.code !== 200) {
        err.text(message);
        err.show();

        showLoadingIcon('createReply', false);

      } else {

        // Refresh main page
        window.location.reload();
      }

    }
  });

  // Return false so we don't submit twice
  return false;
});

//sly
jQuery(function ($) {
  $('#frame').sly({
    horizontal: 1,
    itemNav: 'centered',
    smart: 1,
    activateOn: 'click',
    scrollBy: 1,
    mouseDragging: 1,
    swingSpeed: 1,
    scrollTrap: 1,
    cycleInterval: 1000,
    scrollBar: $('.scrollbar'),
    dragHandle: 1,
    speed: 200,
    startAt: 0
  });
});

//jquery-ui
$(function(){
  $(document).tooltip({
    position: {
      at: "left-7"
    }
  });
});
