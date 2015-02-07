'use strict';

//TODO add bcrypt module
module.exports = function(app, validator, mongoose, moment) {

  var Schema = mongoose.Schema
  var SALT_WORK_FACTOR = 10;

    //user model
  var UserSchema = new Schema({
    username: { type: String, required: true,  unique: true },
    usernameLower: { type: String, required: true,  unique: true },
    email: { type: String, required: true,  unique: true },
    emailLower: { type: String, required: true,  unique: true },
    password: { type: String, required: true }
  });

  var UserMongoObject = mongoose.model('users', UserSchema);

  //FUNCTIONS------------------------------------------

  function handleLoginRequest(req, res) {
    //get user and pass from the request
    var username = validator.toString(req.body.username);
    var password = validator.toString(req.body.password);
    var email = validator.toString(req.body.email);

    var user = new UserMongoObject({
      username: username,
      usernameLower: username.toLowerCase(),
      email: email,
      emailLower: email.toLowerCase(),
      password: password
    });

    //attempts to find user from db
    UserMongoObject.findOne({ username: username }, function(err, userDB) {
      if (err) {
        console.error(err);
        return;
      }

      if (password === userDB.password) {
        res.redirect('/');
        console.log('logged in as ' + username);
      } else {

        //if pass is incorrect, send them back to the login page
        renderLoginPage(req,res, true);
          console.log('username is correct, but password is not');
        }
      });
    }

    function handleRegisterRequest(req, res) {

      var username = validator.toString(req.body.username);
      var password = validator.toString(req.body.password);

      var User = new UserMongoObject({
        username: username,
        password: password
      });

      User.save(function(err) {
        if (err) {
          console.log(err);
        }

        // fetch user and test password verification
        UserMongoObject.findOne({ username: 'jmar777' }, function(err, user) {
          if (err) {
            console.error(err);
            return;
          }
        });
      });
    }

    function renderLoginPage(req, res, wrongPass) {

      UserMongoObject.find(function(err, users) {
        if (err) {
          console.error(err);
        }
            //render template
        res.render('login.html', {
          title: 'Login',
          users: users,
          wrongPass: wrongPass
        });
      });
    }

    app.get('/login', renderLoginPage);
    app.post('/login', handleLoginRequest);

};
