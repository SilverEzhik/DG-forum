'use strict';

// TODO: Clean up this code
// TODO: Add checks to prevent abuse
module.exports = function(app, validator, mongoose, moment) {

  // List of titles i.e. Officer, Guest
  var titles = ['Guest', 'Member', 'Officer', 'President'];

  var isUserName = function (str){
    var regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(str);
  };

  var userSchema = mongoose.Schema({
    username: String,
    usernameLower: String,
    email: String,
    emailLower: String,
    password: String,
    title: Number
  });


  var User = mongoose.model('user', userSchema);

  function handleUserListFetch(req, res) {
    /*
    var templateVars = {
      title: doc.subject,
      thread: doc,
      convertToDate: convertToDate

    };


      // Render template
    res.render('userlist.html', templateVars);
    */
  }

  function handleUserProfileFetch(req, res) {

    var userID = validator.toString(req.params.id);

  }

  function handleSignUpFetch(req, res) {

    var templateVars = {
      title: 'Sign Up'
    };


      // Render template
    res.render('signup.html', templateVars);

  }

  function handleUserCreate(req, res) {
    var userName = validator.toString(req.body.username);
    var email = validator.toString(req.body.email);
    var password = validator.toString(req.body.password);

    if (!validator.isLength(userName, 4, 20)) {
      res.send({
        code: 400,
        message: 'Username must be between 4-20 characters.'
      });
      return;
    }

    // Check to see if the user input a proper username
    if (!isUserName(userName)) {
      res.send({
        code: 400,
        message: 'Username can only contain letters, numbers, dashes, and underscores.'
      });
      return;
    }

    // Check to see if the user input a valid email
    if (!validator.isEmail(userEmail)) {
      res.send({
        code: 400,
        message: 'That is not a valid email.'
      });
      return;
    }

    if (!userPassword) {
      res.send({
        code: 400,
        message: 'Password field cannot be empty.'
      });
      return;
    }

    User.findOne({ username_lower: userName.toLowerCase() }, function(err, doc) {
      if (doc) {
        res.send({
          code: 400,
          message: 'Username already exists.'
        });
        return;
      } else {
        User.findOne({ email_lower: userEmail.toLowerCase() }, function(err, doc2) {
          if (doc2) {
            res.send({
              code: 400,
              message: 'Email already exists.'
            });
            return;
          } else {
            bcrypt.hash(userPassword, 10, function(err, hash){
              var newuser = new User({
                username: userName,
                username_lower: userName.toLowerCase(),
                email: userEmail,
                email_lower: userEmail.toLowerCase(),
                password: hash
              });

              newuser.save(function(err, newuser) {

                // Check to see if the user was successfully added to the DB
                if (err) {
                  res.send({
                    code: 500,
                    message: 'Something went wrong in the database.'
                    // TODO: Add Token?

                  });
                  return console.error(err);
                } else {

                  // TODO: Make users validate their email.

                  // (TEMP) Print to console when a user is created.
                  console.log('Adding new user to DB (name: ' + userName + ' | Email: ' + userEmail + ')');
                  res.send({
                    code: 200,
                    message: 'User created.'

                    // TODO: Add token
                    // token: (inserttokenhere)
                  });

                }
              });
            });
          }
        });
      }
    });
  }

  function handleLogInFetch(req, res) {

  }

  function handleLogInPost(req, res) {

  }

	app.get('/user/', handleUserListFetch);
	app.get('/user/:id', handleUserProfileFetch);
  app.get('/signup', handleSignUpFetch);
  app.post('/signup', handleUserCreate);
  app.get('/login', handleLogInFetch);
  app.post('/login', handleLogInPost);

};



/*

var threadsobject = {
	subject: 'how do i make an html page',
	message: 'Oh Shit, it's a forum',
	author: 'brandon' //username
	timestamp: 47474848
	replies: replyarray

};

*/
