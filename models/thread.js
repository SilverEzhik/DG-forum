'use strict';

//var crypto    = require('crypto');
var mongoose  = require('mongoose');

// Include database model
var db = require('./database');

// Get the ObjectId datatype from mongo
var ObjectId = mongoose.Schema.ObjectId;

var ThreadSchema = mongoose.Schema({
  subject     : { type: String, required: true },
  message     : { type: String, required: true },
  author      : { type: String, required: true },
  prettyId    : { type: String, required: true, unique: true },
  views       : { type: Number, required: true, default: 0 },
  creationDate: { type: Number, default: Date.now },
  lastupdate  : { type: Number, default: Date.now },
  edited      : { type: Boolean, default: false},
  locked      : { type: Boolean, default: false},
  pinned      : { type: Boolean, default: false},
  deleted     : { type: Boolean, default: false},
  replies     : [{
    author      : { type: String, required: true },
    message     : { type: String, required: true },
    creationDate: { type: Number, default: Date.now },
    edited      : { type: Boolean, default: false},
    deleted     : { type: Boolean, default: false}
  }],
  numOfPosts: { type: Number, default: 0},
});

ThreadSchema.pre('save', function (next) {
  var curTime = Date.now();
  this.lastupdate = curTime;
  this.numOfPosts = this.replies.length;
  next();
});

var ThreadMongoModel = db.model('gdThreads', ThreadSchema);


var generatePrettyId = function(callback, counter) {

  if (!counter) {
    counter = 0;
  } else if (counter > 20) {
    var err = new Error('Server is failing to generate prettyId');

    callback(err);
  }

  var id = Math.random().toString(36).substr(2, 5);

  ThreadMongoModel.findOne({ prettyId: id },function(err, doc){

    if (doc) {
      generatePrettyId(callback, counter);
    } else {
      callback(null, id);
    }

  });
  /*
  crypto.pseudoRandomBytes(4, function(err, buf) {

  });
  */
};

var getAllThreads = function(page, callback) {

  // Constant amount of threads to show on page at once
  var LIMIT = 15;

  ThreadMongoModel.count(function(err, count) {
    var lastPage = Math.ceil(count / LIMIT);

    var skip = ( LIMIT * (page - 1) );


    ThreadMongoModel.find({}, {replies: {$slice: -1}, subject: 1, author: 1, prettyId: 1, deleted: 1, pinned: 1, locked: 1, lastupdate: 1, numOfPosts: 1},
      {sort: {lastupdate: -1}, limit: LIMIT, skip: skip},
      function (err, doc) {
        var result;
        if (err) {
          result = {
            code    : 500,
            message : 'Something went wrong in the database.'
          };
          console.error(err);
        }

        callback(result, doc, lastPage);
      }
    );
  });

  /*
  // Grab all threads and sort by last update

  ThreadMongoModel.find({}, null, {sort: {lastupdate: -1}, limit: LIMIT, skip: skip},
    function (err, doc) {
      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database.'
        };
        console.error(err);
      }

      var isLastPage = false;

      if (doc.length % LIMIT !== 0) {
        isLastPage = true;
      }

      callback(result, doc, isLastPage);

    }
  );
*/
};

var getThread = function(id, page, callback) {

  var LIMIT = 15;

  var skip = ( LIMIT * (page - 1) );

  // Find the thread and increment its views by 1
  // {replies: {$slice: [skip, LIMIT]} }
  var query = ThreadMongoModel.findOneAndUpdate({ prettyId: id }, {$inc: {views: 1} });

  query.slice('replies', [skip, LIMIT]);

  query.exec(function (err, doc) {
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

    var lastPage = Math.ceil(doc.numOfPosts / LIMIT);
    callback(result, doc, lastPage);

  });
};

var createThread = function(subject, message, author, callback) {

  generatePrettyId(function(err, id) {

    if (err) {
      return callback(err);
    }

    var newThread = new ThreadMongoModel({
      subject : subject,
      message : message,
      author  : author,
      prettyId: id
    });

    newThread.save(function(err, doc) {

      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database.'
        };
      } else {
        result = {
          code    : 200,
          message : 'Thread created.'
        };
      }

      callback(err, result, doc);
    });

  });

};

var makeReply = function(threadId, message, author, callback) {

  var reply = {
    author: author,
    message: message
  };

  ThreadMongoModel.findOne({ prettyId: threadId },
    function(err, doc) {

      doc.replies.push(reply);
      var result;
      if (err) {
        result = {
          code: 500,
          message: 'Something went wrong in the database.'
        };
        console.error(err);
        callback(result);
      } else {
        doc.save(function(err, doc) {
          if (err) {
            result = {
              code: 500,
              message: 'Something went wrong in the database.'
            };
            console.error(err);
          }
          callback(result, doc);
        });
      }
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
