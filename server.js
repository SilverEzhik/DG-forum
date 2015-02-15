'use strict';

var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
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
app.use(cookieParser());

// Include database model
var db = require('./models/database');

var sess = {
  secret: process.env.SESS_SECRET || 'http://youtu.be/BwBK2xkjaSU',
  store: new MongoStore({ mongooseConnection: db }),
  resave: false,
  saveUninitialized: true,
  cookie: {}
};

if (app.get('env') === 'production') {

  // Set secure cookies when app is in production
  sess.cookie.secure = true;
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
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Tell Express to serve static objects from the /public/ directory
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/user')(app);
require('./routes/forum')(app);

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Developers\' Guild Forum listening at http://%s:%s in %s mode.',
    host, port, app.get('env'));

});
