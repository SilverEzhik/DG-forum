'use strict';

var async     = require('async');
var bcrypt    = require('bcrypt');
var mongoose  = require('mongoose');
var validator = require('validator');

// Include database model
var db = require('./database');

// Titles for users
// README: The Forum Developer title exists so forum developers can have access
// To tools required to work on the forums.
var TITLES = [
  {
    label: 'Guest',
    color: '#ffffff'
  }, {
    label: 'Member',
    color: '#0070FF'
  }, {
    label: 'Officer',
    color: '#00aa00'
  }, {
    label: 'Forum Developer',
    color: '#A06000'
  }
];

var STOCKAVATARS = ['dg.png', 'github.png', 'bitbucket.png', 'deanza.png',
                    'nodejs.png', 'swift.png', 'windows.png', 'osx.png',
                    'linux.png', 'stackoverflow.png'];

// Get a random stock avatar
function getRandomStockAvatar() {
    return STOCKAVATARS[

      // Generate random subscript within the 0 - array length
      Math.floor(Math.floor(Math.random() * STOCKAVATARS.length))
    ];
}

var UserSchema = mongoose.Schema({
  username      : { type: String, required: true,  unique: true },
  usernameLower : { type: String, required: true,  unique: true },
  email         : { type: String, required: true,  unique: true },
  emailLower    : { type: String, required: true,  unique: true },
  password      : { type: String, required: true },
  creationDate  : { type: Number, default: Date.now },
  title         : { type: Number, default: 0 },
  banned        : { type: Boolean, default: false },
  retired       : { type: Boolean, default: false },
  lastActivity  : { type: Number, default: Date.now },
  profile       : {
    fullName      : { type: String, required: true },
    avatarPath    : { type: String, default: getRandomStockAvatar },
    bio           : { type: String },
    website       : { type: String },
    githubName    : { type: String }
  }
});

var UserMongoModel = db.model('users', UserSchema);

var logInUser = function(usernameEmail, password, callback) {

  if (validator.isEmail(usernameEmail)) {
    UserMongoModel.findOne({ emailLower: usernameEmail.toLowerCase() },
      function(err, doc) {
        var result;
        if (!doc) {
          result = {
            code    : 400,
            message : 'Can\'t find that email.'
          };
          callback(result);
        } else {
          bcrypt.compare(password, doc.password, function(err, correct) {
            if (!correct) {
              result = {
                code    : 400,
                message : 'You entered the wrong password'
              };
              callback(result);
            } else {
              callback(result, doc);
            }
          });
        }
      }
    );
  } else {
    UserMongoModel.findOne({ usernameLower: usernameEmail.toLowerCase() },
      function(err, doc) {
        var result;
        if (!doc) {
          result = {
            code    : 400,
            message : 'Can\'t find that username.'
          };
          callback(result);
        } else {
          bcrypt.compare(password, doc.password, function(err, correct) {
            if (!correct) {
              result = {
                code    : 400,
                message : 'You entered the wrong password'
              };
              callback(result);
            } else {
              callback(result, doc);
            }
          });
        }
      }
    );
  }
};

var createUser = function(username, email, password, fName, callback) {

  // Use series to check to see if username or email already exists
  async.series([
    function(seriesCallback) {
      UserMongoModel.findOne({ usernameLower: username.toLowerCase() },
        function(err, doc) {
          var result;
          if (doc) {

            // Non-null result ends the series immediately.
            result = {
              code    : 400,
              message : 'Username already exists.'
            };
          }
          seriesCallback(result);
        }
      );
    }
  , function(seriesCallback) {
      UserMongoModel.findOne({ emailLower: email.toLowerCase() },
        function(err, doc) {
          var result;
          if (doc) {

            // Non-null result ends the series immediately.
            result = {
              code    : 400,
              message : 'Email already exists.'
            };
          }
          seriesCallback(result);
        }
      );
    }
  ]
  , function(result) {
      if (result) {
        callback(result);
      } else {
        bcrypt.hash(password, 10, function(err, hash) {
          var NewUser = new UserMongoModel({
            username      : username,
            usernameLower : username.toLowerCase(),
            email         : email,
            emailLower    : email.toLowerCase(),
            password      : hash,
            profile : {
              fullName: fName
            }
          });

          NewUser.save(function(err, doc) {

            var result;

            if (err) {
              result = {
                code    : 500,
                message : 'Something went wrong in the database. Try again.'
              };
            } else {
              result = {
                code    : 200,
                message : 'User successfully added to the database.'

              };
            }

            callback(result);

          });
        });
      }
    });

};

var getUser = function() {

};

var getAllUsers = function() {

};

var UserModel = {
  login : logInUser,
  create: createUser,
  get   : getUser,
  getAll: getAllUsers
};

module.exports = UserModel;
