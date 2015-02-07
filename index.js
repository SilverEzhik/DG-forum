'use strict';

var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var express       = require('express');
var nunjucks      = require('nunjucks');
var path          = require('path');
var session       = require('express-session');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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

  console.log('Developers\' Guild Forum listening at http://%s:%s', host, port);

});
