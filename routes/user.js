
module.exports = function(app) {

  'use strict';
  var https = require('https');
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

  var SECRET = process.env.CAPTCHA_SECRET ||
              '6Lc4KAETAAAAAPAytG014cMHnx_89YCWk-269q4s';

  function verifyRecaptcha(key, callback) {
    https.get('https://www.google.com/recaptcha/api/siteverify?secret=' +
      SECRET + '&response=' + key, function(res) {
        var data = '';
        res.on('data', function (chunk) {
                data += chunk.toString();
        });
        res.on('end', function() {
          try {
            var parsedData = JSON.parse(data);
            callback(parsedData.success);
          } catch (e) {
            callback(false);
          }
        });
      }
    );
  }

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

      res.send({
        code    : 200,
        message : 'You have logged in.'
      });

    });
  };

  var handleSignupRequest = function(req, res) {

    // Captcha key
    var key = req.body['g-recaptcha-response'];

    verifyRecaptcha(key, function(success) {
      if (!success) {

        result = {
          code    : 400,
          message : 'Captcha failed. Try again.'
        };
        res.send(result);
        return;

      } else {

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

        // Check to see if username is between 4-20 characters
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

            req.session.user = doc;

            // 1 week
            var week = 1000 * 60 * 60 * 24 * 7;

            // Set the session to expire in a week
            req.session.cookie.expires = new Date(Date.now() + week);

            res.send({
              code    : 200,
              message : 'Account successfully created.'
            });
          }

        });
    }
    });
  };

  var handleLogoutRequest = function(req, res) {

    if (!req.session.user) {
      var result = {
        code    : 400,
        message : 'You are not logged in.'
      };
      res.send(result);
      return;
    }

    req.session.destroy(function(err) {
      res.redirect('back');
    });
  };

  var handleProfileRequest = function(req, res) {

    //sanitize username
    var username = validator.toString(req.params.userid);

    //use the User model and get the User
    User.get(username, function(errResult, doc) {

      //not sure if this is clean
      if (!doc) {
        res.send(errResult);
      } else {
        res.send({
          code: 200,
          message: 'User found',
          user: doc
        });
      }
    });

  };

   var handleUserAvatarChange = function(req, res) {

    var avatar = validator.toString(req.body.avatar);
    var user = req.session.user;

    var result;

    if (!user) {
      result = {
        code    : 400,
        message : 'You are not logged in.'
      };
      res.send(result);
      return;
    }

    if (!avatar) {
      result = {
        code    : 400,
        message : 'Invalid avatar.'
      };
      res.send(result);
      return;
    }

    User.changeAvatar(user.username, avatar, function(result) {
      res.send(result);
    });
  };

  app.post('/login'       , handleLoginRequest);
  app.get('/logout'       , handleLogoutRequest);
  app.post('/signup'      , handleSignupRequest);
  app.get('/user/:userid' , handleProfileRequest);
  app.post('/changeavatar', handleUserAvatarChange);

};
