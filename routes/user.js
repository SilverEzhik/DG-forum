
module.exports = function(app) {

  'use strict';
  var validator = require('validator');

  var User = require('.././models/user');

  // Username can only contain letters, numbers, underscores, and dashes
  var isUsername = function (str) {
    var regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(str);
  };

  // Full Name can only contain letters and spaces.
  var isFullName = function (str) {
    var regex = /^[a-zA-Z ]+$/;
    return regex.test(str);
  };

  var handleLoginRequest = function(req, res) {

    var usernameEmail  = validator.toString(req.body.usernameEmail);
    var password  = validator.toString(req.body.password);

    var result;

    if (req.session.user) {
      result = {
        code    : 400,
        message : 'You are already logged in.'
      };
      res.send(result);
      return;
    }
    if (!usernameEmail) {
      result = {
        code    : 400,
        message : 'Username/Email field cannot be empty.'
      };
      res.send(result);
      return;
    }

    if (!password) {
      result = {
        code    : 400,
        message : 'Password field cannot be empty.'
      };
      res.send(result);
      return;
    }

    User.login(usernameEmail, password, function(err, doc) {
      if (err) {
        res.send(err);
        return;
      }

      req.session.user = doc;

      //         ms      s    m    h    d
      var week = 1000 * 60 * 60 * 24 * 7;

      // Set the session to expire in a week
      req.session.cookie.expires = new Date(Date.now() + week);

      res.send('You logged in!');

    });
  };

  var handleSignupRequest = function(req, res) {

    var username  = validator.toString(req.body.username);
    var email     = validator.toString(req.body.email);
    var password  = validator.toString(req.body.password);
    var fName     = validator.toString(req.body.fName);

    var result;

    if (req.session.user) {
      result = {
        code    : 400,
        message : 'You already have an account.'
      };
      res.send(result);
      return;
    }

    // Check to see if the user input a username that's between 4-20 characters
    if (!validator.isLength(username, 4, 20)) {
      result = {
        code    : 400,
        message : 'Username must be between 4-20 characters.'
      };
      res.send(result);
      return;
    }

    if (!isUsername(username)) {
      result = {
        code    : 400,
        message : 'Username can only contain letters, numbers, ' +
                  'dashes, and underscores.'
      };
      res.send(result);
      return;
    }

    if (!validator.isEmail(email)) {
      result = {
        code    : 400,
        message : 'That is not a valid email.'
      };
      res.send(result);
      return;
    }

    if (!password) {
      result = {
        code    : 400,
        message : 'Password field cannot be empty.'
      };
      res.send(result);
      return;
    }

    if (!fName) {
      result = {
        code    : 400,
        message : 'First Name field cannot be empty.'
      };
      res.send(result);
      return;
    }

    if (!isFullName(fName)) {
      result = {
        code    : 400,
        message : 'Full Name can only contain letters and spaces.'
      };
      res.send(result);
      return;
    }

    User.create(username, email, password, fName, function(err, doc) {
      if (err) {
        res.send(err);
      } else {
        //doc
      }
    });
  };

  var renderLoginPage = function(req, res, wrongPass) {



    var templateVars = {
      title: 'Login',
      sessUser: req.session.user
    };

    //render template
    res.render('login.html', templateVars);
  };

  app.get('/login'  , renderLoginPage);
  app.post('/login' , handleLoginRequest);
  app.post('/signup', handleSignupRequest);
};
