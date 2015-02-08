'use strict';

// TODO: Clean up this code
// TODO: Add checks to prevent abuse
module.exports = function(app) {

  var moment    = require('moment');
  var validator = require('validator');

  var Thread  = require('.././models/thread');

  // Convert unix timestamps into readable human time
  var convertToDate = function(timeStamp) {

    // Get current time in Unix
    var curTime = moment().unix();
    var timeDifference = (curTime - timeStamp);
    if (timeDifference < 60) {

      return (timeDifference + ' seconds ago');

      // else if time difference is less than an hour
    } else if (timeDifference < (60 * 60) ) {

      var minutes = Math.floor(timeDifference / 60);
      return (minutes + ' minutes ago');

      // else if time is less than a day
    } else if (timeDifference < (60 * 60 * 24) ) {

      var hours = Math.floor(timeDifference / (60 * 60) );
      return (hours + ' hours ago');

      // else if time is less than 7 days (a week)
    } else if (timeDifference < (60 * 60 * 24 * 7) ) {

      var days = Math.floor(timeDifference / (60 * 60 * 24) );
      return (days + ' days ago');

      // else if time is less than 4 weeks
    } else if (timeDifference < (60 * 60 * 24 * 7 * 4) ) {

      var weeks = Math.floor(timeDifference / (60 * 60 * 24 * 7) );
      return (weeks + ' weeks ago');

    } else {

      // TODO: Make this return a proper date etc. January 21, 2015
      return moment.unix(timeStamp).format('MMMM Do, YYYY');
    }

  };

  var handleForumFetch = function(req, res) {

    // Grab all threads.
    Thread.getAll(function(err, doc) {

      if (err) {
        res.send(err);
        return;
      }

      var templateVars = {
        title: '',
        threads: doc,
        convertToDate: convertToDate
      };


      // Render template
      res.render('forum.html', templateVars);
    });
  };

  var handleThreadFetch = function(req, res) {

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
        convertToDate: convertToDate
      };

      // Render template
      res.render('thread.html', templateVars);
    });
  };

  var handleThreadCreate = function(req, res) {
    var subject = validator.toString(req.body.subject);
    var message = validator.toString(req.body.message);

    // TODO: Replace this with the actual name of the author
    var author = 'Anonymous';

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

    Thread.create(subject, message, author, function(err, doc) {

      if (err) {
        res.send(err);
        return;
      } else {

        console.log('New thread created');
        res.redirect('/thread/'+ doc.shortid);
      }

    });
  };

  var handleThreadReply = function(req, res) {

    var threadID = validator.toString(req.params.id);

    var message = validator.toString(req.body.message);

    // TODO: Change this to the actually author
    var author = 'Anonymous';

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
