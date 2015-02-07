'use strict';

var mongoose = require('mongoose');

// Tell Mongoose where our db is located. In this case, we are getting
// the environment variable SERVER_IP which should be saved in the bash
// in the folder DG-Forum
var mongoAddress  = process.env.MONGO_ADDRESS   || '127.0.0.1';
var mongoPort     = process.env.MONGO_PORT      || '27017';
var mongoDatabase = process.env.MONGO_DATABASE  || 'dgforum';
var mongoOptions  = {
  user: process.env.MONGO_USER || undefined,
  pass: process.env.MONGO_PASS || undefined
};

var db = mongoose.createConnection();

// Initialize connection to the database
db.open(mongoAddress, mongoDatabase, mongoPort, mongoOptions);

// Let's check to see if the app has successfully connected to the DB.
db.on('error', function(err) {
  throw err;
});
db.once('open', function() {
    console.log('Connection to DB established');
});

module.exports = db;

