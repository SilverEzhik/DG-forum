
module.exports = function(app) {

  'use strict';

  var moment    = require('moment');
  var validator = require('validator');

  var User = require('.././models/user');

  var isUsername = function (str) {
    var regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(str);
  };

  var handleLoginRequest = function(req, res) {

    var usernameEmail  = validator.toString(req.body.usernameEmail);
    var password  = validator.toString(req.body.password);

    var result;
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
      res.send('you logged in!');

    });
  };

  var handleSignupRequest = function(req, res) {

    var username  = validator.toString(req.body.username);
    var email     = validator.toString(req.body.email);
    var password  = validator.toString(req.body.password);
    var fName     = validator.toString(req.body.fName);
    var lName     = validator.toString(req.body.lName);

    var result;

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

    if (!lName) {
      result = {
        code    : 400,
        message : 'Last Name field cannot be empty.'
      };
      res.send(result);
      return;
    }

    if (!validator.isAlpha(fName)) {
      result = {
        code    : 400,
        message : 'First Name can only contain letters.'
      };
      res.send(result);
      return;
    }

    if (!validator.isAlpha(lName)) {
      result = {
        code    : 400,
        message : 'Last Name can only contain letters.'
      };
      res.send(result);
      return;
    }

    User.create(username, email, password, fName, lName, function(err, doc) {
      if (err) {
        res.send(err);
      } else {
        //doc
      }
    });
  };

  var renderLoginPage = function(req, res, wrongPass) {

    var templateVars = {
      title: 'Login'
    };

    //render template
    res.render('login.html', templateVars);
  };

  app.get('/login'  , renderLoginPage);
  app.post('/login' , handleLoginRequest);
  app.post('/signup', handleSignupRequest);
};
