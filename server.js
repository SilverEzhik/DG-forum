'use strict';

var bodyParser    = require('body-parser');
var express       = require('express');
// var multer        = require('multer');
var nunjucks      = require('nunjucks');
var path          = require('path');
var session       = require('express-session');

var MongoStore = require('connect-mongo')(session);

// Use middleware
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Include database model
var db = require('./models/database');

var User = require('./models/user');

var sess = {
  secret: process.env.SESS_SECRET || 'http://youtu.be/BwBK2xkjaSU',
  store: new MongoStore({ mongooseConnection: db }),
  resave: false,
  saveUninitialized: true,
  cookie: {}
};

var SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'localhost';
var SERVER_PORT = process.env.SERVER_PORT || 3000;


if (app.get('env') === 'production') {



  // Set secure cookies when app is in production
  //sess.cookie.secure = true;
}


app.use(session(sess));

/*
app.use(function(req, res, next) {
  var handler = multer({
    dest: './uploads/',
    onFileUploadStart: function (file) {

      // req.session
      // TODO: Check to see if the file is too big
      // If the file type isn't what we want
      if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' &&
        file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
        return false;
      } else {
        console.log(file.fieldname + ' is starting ...');
      }
    }
  });
  handler(req, res, next);
});
*/

// Tell Nunjucks where the templates are stored.
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'),
                                    { autoescape: false });
env.express(app);

env.addFilter('getUserAvatar', function(username, callback) {

  //got an error on the 'multi line' thread because username returns undefined
  if(username){
    User.getAvatar(username, callback);
  }
}, true);

env.addFilter('getUserTitle', function(username, callback) {
  User.getTitle(username, callback);
}, true);

env.addFilter('getForumDev', function(username, callback) {
  User.getForumDev(username, callback);
}, true);

env.addFilter('getOnline', function(username, callback) {
  User.getOnlineStatus(username, callback);
}, true);

// Tell Express to serve static objects from the /public/ directory
app.use(express.static(path.join(__dirname, 'public')));

//put the forum require before the user because the app.all('*')
//is chained to all other requests
require('./routes/forum')(app);
require('./routes/user')(app);

// Handle 404 Error
app.use(function(req, res, next) {
  var templateVars =
  {
    code: 404,
    message: 'Not Found'
  };
  res.render('error.html', templateVars);
});


var server = app.listen(SERVER_PORT, SERVER_ADDRESS, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Developers\' Guild Forum listening at http://%s:%s in %s mode.',
    host, port, app.get('env'));

});
