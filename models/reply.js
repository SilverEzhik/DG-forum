'use strict';

var mongoose  = require('mongoose');

// Include database model
var Db = require('./database');
var Thread = require('../models/thread');


var ReplySchema = mongoose.Schema({
  message     : {type: String, required: true},
  author      : {type: String, required: true},
  thread      : {type: String, required: true},
  creationDate: {type: Date, default: Date.now},
  flags       : {
    edited      : { type: Boolean, default: false},
    deleted     : { type: Boolean, default: false}
  },
  lastEdit    : {
    editor      : {type: String},
    time        : {type: Date},
    reason      : {type: String}
  },
  deleteInfo  : {
    deleter     : {type: String},
    time        : {type: Date},
    reason      : {type: String}
  }
});

var ReplyMongoModel = Db.model('replies', ReplySchema);

var createReply = function(threadId, message, author, callback) {

  // threadId is the thread's Id
  // author is author's username

  ReplyMongoModel.create({
    message: message,
    author: author,
    thread: threadId

  },
    function(err, reply) {
      var result;
      if (err) {
        result = {
          code: 500,
          message: 'Something went wrong in the database.'
        };
        console.error(err);
      }
      callback(result, reply);
    }
  );

};

var getAllRepliesInThread = function(threadId, skip, limit, callback) {
  if (skip === 0) {
    limit = (--limit);
  }
  ReplyMongoModel.find({thread: threadId}, null, {sort: {creationDate: 1}, skip: skip, limit: limit},
    function(err, replies) {
    var result;
    if (err) {
      result = {
        code: 500,
        message: 'Something went wrong in the database.'
      };
    }
    callback(result, replies);
  });
  // NOTE: It's ok if there is nothing found in the query
};

var countAmountOfReplies = function(threadId, callback) {
  ReplyMongoModel.count({thread: threadId}, function(err, count) {
    var result;
    if (err) {
      result = {
        code: 500,
        message: 'Something went wrong in the database.'
      };
    }
    callback(result, count);
  });
};

var ReplyModel = {
  create: createReply,
  getAll: getAllRepliesInThread,
  count: countAmountOfReplies
};

module.exports = ReplyModel;
