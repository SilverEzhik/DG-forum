'use strict';

var moment    = require('moment');
var mongoose  = require('mongoose');
var shortId   = require('shortid');

// Include database model
var db = require('./database');

// Get the ObjectId datatype from mongo
var ObjectId = mongoose.Schema.ObjectId;

var ThreadSchema = mongoose.Schema({
  subject     : { type: String, required: true },
  message     : { type: String, required: true },
  author      : { type: String, required: true },
  shortid     : { type: String, required: true, unique: true,
    default   : shortId.generate },
  views       : { type: Number, required: true, default: 0 },
  creationDate: { type: Number, default: moment().unix() },
  lastupdate  : { type: Number, default: moment().unix() },
  replies     : [{
    author      : { type: String, required: true },
    message     : { type: String, required: true },
    creationDate: { type: Number, default: moment().unix() }
  }]
});

var ThreadMongoModel = db.model('threads', ThreadSchema);

var getAllThreads = function(callback) {

  // Grab all threads and sort by last update
  ThreadMongoModel.find({}, null, {sort: {lastupdate: -1}},
    function (err, doc) {
      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database.'
        };
        console.error(err);
      }
      callback(result, doc);

    }
  );
};

var getThread = function(id, callback) {

  // Find the thread and increment its views by 1
  ThreadMongoModel.findOneAndUpdate({ shortid: id },{$inc: {views: 1} },
    function (err, doc) {
      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database.'
        };
        console.error(err);
      } else if (!doc) {
        result = {
          code    : 400,
          message : 'Thread not found.'
        };
      }
      callback(result, doc);

    }
  );
};

var createThread = function(subject, message, author, callback) {

  var newThread = new ThreadMongoModel({
    subject : subject,
    message : message,
    author  : author
  });

  newThread.save(function(err, doc) {

    var result;
    if (err) {
      result = {
        code    : 500,
        message : 'Something went wrong in the database.'
      };

      console.error(err);
    }

    callback(result, doc);
  });

};

var makeReply = function(threadId, message, author, callback) {

  // Get current time in unix
  var curTime = moment().unix();

  var reply = {
    author: author,
    message: message
  };

  ThreadMongoModel.findOneAndUpdate({ shortid: threadId },
  {$push: {replies: reply},lastupdate: curTime}, {safe: true, upsert: true},
    function(err, doc) {
      var result;
      if (err) {
        result = {
          code: 500,
          message: 'Something went wrong in the database.'
        };
        console.error(err);

      }
      callback(result, doc);
    }
  );
};

var ThreadModel = {
  get       : getThread,
  getAll    : getAllThreads,
  create    : createThread,
  makeReply : makeReply
};

module.exports = ThreadModel;
