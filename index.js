var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser());

// Tell Monk where our db is located
// TODO: Host the DB on another server to avoid headaches.
var db = monk('localhost:27017/dg-site');

// Tell Nunjucks where the templates are stored.
nunjucks.configure('views', { 
	autoescape: true,
	express: app
});

// Tell Express to serve static objects from the /public/ directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.send('Get Request On /');
});

var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Developers\' Guild Forum listening at http://%s:%s', host, port);

});