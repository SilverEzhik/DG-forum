'use strict';

// TODO: Clean up this code
// TODO: Add checks to prevent abuse
module.exports = function(app) {

  var moment    = require('moment');
  var validator = require('validator');
  var User = require('.././models/user');
  var Thread  = require('.././models/thread');

  // Conver timestamps into readable human time
  var convertToDate = function(timeStamp) {

      return moment(timeStamp).fromNow();
  };

  var handleForumFetch = function(req, res) {

    //should i do this every method request?
    //or should i just save it in req.onlineusers
    //so other methods can use it
    var onlineUsers;

    User.getActiveMembers(function(docs){
      onlineUsers = docs;
    });

    if(req.session.user)
      User.updateActivity(req.session.user);

    // Refresh the user's session expiration date if they view the forums
    // so that active users can continuously use the forums
    if (req.session.user) {

      // 1 week
      var week = 1000 * 60 * 60 * 24 * 7;

      // Set the session to expire in a week
      req.session.cookie.expires = new Date(Date.now() + week);
    }

    // Grab all threads.
    Thread.getAll(function(err, doc) {

      if (err) {
        res.send(err);
        return;
      }

      var templateVars = {
        title: '',
        threads: doc,
        convertToDate: convertToDate,
        sessUser: req.session.user,
        onlineUsers: onlineUsers
      };

      // Render template
      res.render('forum.html', templateVars);
    });
  };

  var handleThreadFetch = function(req, res) {

    var onlineUsers;

    User.getActiveMembers(function(docs){
      onlineUsers = docs;
    });

    if(req.session.user)
      User.updateActivity(req.session.user);

    // Find the thread
    var threadID = validator.toString(req.params.id);

    if (!threadID) {
      var result = {
        code    : 400,
        message : 'Thread not found.'
      };

      res.send(result);
      return;
    }

    Thread.get(threadID, function(err, doc) {
      if (err) {
        res.send(err);
        return;
      }

      var templateVars = {
        title: doc.subject,
        thread: doc,
        convertToDate: convertToDate,
        sessUser: req.session.user,
        onlineUsers: onlineUsers
      };

      // Render template
      res.render('thread.html', templateVars);
    });
  };

  var handleThreadCreate = function(req, res) {

    if(req.session.user)
      User.updateActivity(req.session.user);

    var subject = validator.toString(req.body.subject);
    var message = validator.toString(req.body.message);

    // TODO: Replace this with the actual name of the author
    var author = req.session.user.username;

    //var author = req.session.author;
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

    Thread.create(subject, message, author, function(err, result, doc) {

      if (err) {

        res.send(result);

        return console.error(err);
      } else {

        console.log('New thread created');
        res.redirect('/thread/'+ doc.prettyId);
      }

    });
  };

  var handleThreadReply = function(req, res) {

    if(req.session.user)
      User.updateActivity(req.session.user);

    var threadID = validator.toString(req.params.id);
    var message = validator.toString(req.body.message);
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

    if (!threadID) {
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

    Thread.makeReply(threadID, message, author,
      function(err, doc) {
        if (err) {
          res.send(err);
          return;
        }
        res.redirect('/thread/' + threadID);
      }
    );
  };

  app.get('/'                 , handleForumFetch);
  app.post('/makethread'      , handleThreadCreate);
  app.get('/thread/:id'       , handleThreadFetch);
  app.post('/thread/:id/reply', handleThreadReply);

};
