'use strict';

// TODO: Clean up this code
// TODO: Add checks to prevent abuse
module.exports = function(app) {

  var moment    = require('moment');
  var validator = require('validator');

  var User = require('.././models/user');
  var Thread  = require('.././models/thread');
  var Reply  = require('.././models/reply');

  // Convert timestamps into readable human time
  var convertToDate = function(timeStamp) {

      return moment(timeStamp).fromNow();
  };

  var handleForumFetch = function(req, res) {

    var page = validator.toInt(validator.escape(req.query.page)) || 1;

    // (TEMP)
    var section = 0;
    // validation for page
    if ( (page < 1) || (page % 1 !== 0) ) {
      page = 1;
    }



    // Grab all threads.
    Thread.getAll(section, page, function(err, threads, lastPage) {

      if (err) {
        res.send(err);
        return;
      }

      // If user is on a page with no threads, redirect them to index
      if ((page !== 1) && (page > lastPage)) {
        res.redirect('/');
        return;
      }

      User.getActiveUsers(function(docs) {
        var onlineUsers = docs;

        var templateVars = {
          title: '',
          threads: threads,
          page: page,
          lastPage: lastPage,
          convertToDate: convertToDate,
          sessUser: req.session.user,
          onlineUsers: onlineUsers
        };

        // Render template

        res.render('forum.html', templateVars);



      });
    });

  };

  var handleThreadFetch = function(req, res) {

    var page = validator.toInt(validator.escape(req.query.page)) || 1;

    // validation for page
    if ( (page < 1) || (page % 1 !== 0) ) {
      page = 1;
    }

    // Find the thread
    var threadID = validator.toString(req.params.id);

    if (!threadID) {
      var templateVars = {
        title: 'Thread not found.',
        code: 404,
        message: 'Thread not found.'
      };
      res.render('error.html', templateVars);
    }

    Thread.get(threadID, page, function(err, thread, replies, lastPage) {
      var templateVars;
      if (err) {

        templateVars = {
          title: 'Thread not found',
          code: err.code,
          message: err.message
        };
        res.render('error.html', templateVars);
      } else {

        templateVars = {
          title: thread.subject,
          thread: thread,
          replies: replies,
          page: page,
          lastPage: lastPage,
          convertToDate: convertToDate,
          sessUser: req.session.user
        };

        // Render template
        res.render('thread.html', templateVars);
      }
    });
  };

  var handleThreadCreate = function(req, res) {

    var subject = validator.toString(validator.escape(req.body.subject));
    var message = validator.toString(validator.escape(req.body.message));

    var author = req.session.user.username;

    //var author = req.session.author;

    // (TEMP)
    var section = 0;
    var result;

    if (!author) {
      result = {
        code    : 400,
        message : 'You are not logged in.'
      };
      res.send(result);
      return;
    }

    if (!subject) {
      result = {
        code    : 400,
        message : 'Title may not be blank.'
      };
      res.send(result);
      return;
    }

    // Check to see if the title length is between 1-85 characters
    if (!validator.isLength(subject, 1, 85)) {
      result = {
        code    : 400,
        message : 'Title cannot be more than 85 characters.'
      };
      res.send(result);
      return;
    }

    if (!message) {
      result = {
        code    : 400,
        message : 'Message body may not be blank.'
      };
      res.send(result);
      return;
    }

    Thread.create(subject, message, author, section, function(result, doc) {

      if (result) {

        res.send(result);
      } else {

        console.log('New thread created');
        res.send({
          code: 200,
          message: 'Thread successfully created.'
        });
      }

    });
  };

  var handleThreadReply = function(req, res) {

    var threadId = validator.toString(validator.escape(req.params.id));
    var message = validator.toString(validator.escape(req.body.message));
    var author = req.session.user.username;


    var result;

    if (!author) {
      result = {
        code    : 400,
        message : 'You are not logged in.'
      };
      res.send(result);
      return;
    }

    if (!threadId) {
      result = {
        code    : 400,
        message : 'Thread not found.'
      };
      res.send(result);
      return;
    }

    if (!message) {
      result = {
        code    : 400,
        message : 'Message body cannot be empty.'
      };
      res.send(result);
      return;
    }


    Reply.create(threadId, message, author, function(err, reply) {

      if (err) {
        res.send(err);
      } else {

        Thread.updateLastPost(threadId, author, function(err, thread) {
            if (err) {
              res.send(err);
              return;
            }
            res.send({
              code: 200,
              message: 'Reply successfully created.'
            });
          }
        );
      }
    });
  };

  var handleOnEveryRequest = function(req, res, next) {

    // TODO: Check if request is logout
    if (req.session.user) {
      User.updateActivity(req.session.user.username, function(err) {
        if (err) {
          console.error(err);
        }
      });


      // Refresh the user's session expiration date if they view the forums
      // so that active users can continuously use the forums
      // 1 week
      var week = 1000 * 60 * 60 * 24 * 7;

      // Set the session to expire in a week
      req.session.cookie.expires = new Date(Date.now() + week);
    }

    next();
  };

  app.all('*'                 , handleOnEveryRequest);
  app.get('/'                 , handleForumFetch);
  app.post('/makethread'      , handleThreadCreate);
  app.get('/thread/:id'       , handleThreadFetch);
  app.post('/thread/:id/reply', handleThreadReply);

};
