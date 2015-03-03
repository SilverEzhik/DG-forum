'use strict';

//var crypto    = require('crypto');
var mongoose  = require('mongoose');

// Include database and reply model
var Db = require('./database');
var Reply = require('./reply');

var ThreadSchema = mongoose.Schema({
  subject     : { type: String, required: true },
  message     : { type: String, required: true },
  author      : { type: String, required: true },
  prettyId    : { type: String, required: true, unique: true },
  section     : { type: Number, required: true},
  views       : { type: Number, default: 0 },
  creationDate: { type: Date, default: Date.now },
  flags       : {
    edited      : { type: Boolean, default: false},
    locked      : { type: Boolean, default: false},
    pinned      : { type: Boolean, default: false},
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
  },
  lastPost    : {
    author      : {type: String, required: true},
    post        : {type: Number, default: 0 },
    time        : {type: Date, default: Date.now}
  }
});

var ThreadMongoModel = Db.model('threads', ThreadSchema);


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

};

var getAllThreads = function(section, page, callback) {

  // Constant amount of threads to show on page at once
  var LIMIT = 15;

  ThreadMongoModel.count(function(err, count) {
    var lastPage = Math.ceil(count / LIMIT);

    var skip = ( LIMIT * (page - 1) );

    ThreadMongoModel.find({section: section},
      '_id subject author prettyId flags lastPost',
      {sort: {'lastPost.time': -1} , limit: LIMIT, skip: skip},
      function (err, thread) {
        var result;
        if (err) {
          result = {
            code    : 500,
            message : 'Something went wrong in the database.'
          };
          console.error(err);
        }

        callback(result, thread, lastPage);
      }
    );
  });

};

var getThread = function(id, page, callback) {

  var LIMIT = 15;

  var skip = ( LIMIT * (page - 1) );

  // Find the thread and increment its views by 1
  // {replies: {$slice: [skip, LIMIT]} }
  ThreadMongoModel.findOneAndUpdate({ prettyId: id }, {$inc: {views: 1} },
    function (err, thread) {

      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database.'
        };
        console.error(err);
        callback(result);
      } else if (!thread) {
        result = {
          code    : 400,
          message : 'Thread not found.'
        };
        callback(result);
      } else {
        Reply.getAll(thread.prettyId, skip, LIMIT,
          function(err, replies) {
            if (err) {
              callback(err);
            } else {
              Reply.count(thread.prettyId, function(err, count) {
                var lastPage = Math.ceil(count / LIMIT);
                callback(err, thread, replies, lastPage);
              });
            }
          }
        );
      }

    }
  );
};

var createThread = function(subject, message, author, section, callback) {

  generatePrettyId(function(err, id) {

    if (err) {
      return callback(err);
    }

    ThreadMongoModel.create({
      subject : subject,
      message : message,
      author  : author,
      prettyId: id,
      section : section,
      lastPost: {
        author: author
      }
    }, function(err, thread) {

      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database.'
        };
        console.error(err);
      }

      callback(result, thread);
    });

  });

};

var updateThreadLastPost = function(threadId, author, callback) {
  // threadId is prettyId

  Reply.count(threadId, function(err, count) {

    if (err) {
      callback(err);
    } else {
      var curTime = Date.now();
      ThreadMongoModel.findOneAndUpdate({prettyId: threadId},
        {
          $inc: {
            'lastPost.post': count
          },
          $set: {
            'lastPost.author': author,
            'lastPost.time': curTime
          }
        },
        function(err, thread) {
          var result;
          if (err) {
            result = {
              code: 500,
              message: 'Something went wrong in the database.'
            };
            console.error(err);
          } else if (!thread) {
            result = {
              code: 400,
              message: 'Thread not found.'
            };
          }
          callback(result, thread);
        }
      );
    }
  });
};

var ThreadModel = {
  get           : getThread,
  getAll        : getAllThreads,
  create        : createThread,
  updateLastPost: updateThreadLastPost
};

module.exports = ThreadModel;
