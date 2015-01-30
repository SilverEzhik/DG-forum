
// TODO: Clean up this code
// TODO: Add checks to prevent abuse
module.exports = function(app, validator, mongoose) {

  var threadSchema = mongoose.Schema({
    subject: String,
    message: String,
    author: String,
    timestamp: Number,
    lastupdate: Number,
    replies: [{
      author: String,
      message: String,
      timestamp: Number
    }]
  });

  var Thread = mongoose.model('thread', threadSchema);

  // Convert milliseconds(argument) to Unix seconds
  function convertToUnix(time) {
    return Math.floor(time / 1000);
  }

  // Convert unix seconds(argument) to readable human time
  function convertToDate(timeStamp) {
    var date = new Date();

    // Get Current Time in Unix
    var curTime = convertToUnix(date.getTime());

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

      // TODO: Make this return a proper time stamp etc. January 21, 2015
      return Date(timeStamp);
    }

  }

  function handleForumFetch(req, res) {
    // We grab all the threads and sort by its last update
    Thread.find({}, null, {sort: {lastupdate: -1}}, function (err, doc) {
      if (err) return console.error(err);
    

      // Send function to template instead
      var templateVars = {
        title: 'Forums',
        threads: doc,
        convertToDate: convertToDate
        
      };

      
      // Render template
      res.render('forum.html', templateVars);
    });
  }

  function handleThreadCreate(req, res) {
    var subject = validator.toString(req.body.subject);
    var message = validator.toString(req.body.message);

    // TODO: Replace this with the actual name of the author
    var author = 'Anonymous';

    //var author = req.session.author;

    var date = new Date();

    // Convert to Unix Time (NO DECIMALS)
    var timeStamp = convertToUnix(date.getTime());

    var newThread = new Thread({
      subject: subject,
      message: message,
      author: author,
      timestamp: timeStamp,
      lastupdate: timeStamp
     });

    newThread.save(function(err, newThread) {

      if (err) {
        res.send('Error 500: Something went wrong in the database');
        return console.error(err);
      } else {

        console.log('New thread created');
        res.redirect('/');
      }

    });
  }

  function handleThreadReply(req, res) {

    var threadID = validator.toString(req.params.id);
    var date = new Date();

    // Convert to Unix Time (NO DECIMALS)
    var timeStamp = convertToUnix(date.getTime());

    // TODO: Change this to the actually author
    var author = 'Anonymous';

    var message = validator.toString(req.body.message);

    var reply = {
      author: author,
      message: message,
      timestamp: timeStamp
    };

    Thread.findByIdAndUpdate(threadID, {$push: {replies: reply}, lastupdate: timeStamp}, 
    {safe: true, upsert: true}, function(err, doc) {
        if (err) {
          res.send('Error 500: Something went wrong in the database');
          return console.error(err);
        }

        console.log('New reply created');
        res.redirect('/');
      });

  }

	app.get('/', handleForumFetch);
	app.post('/makethread', handleThreadCreate);
  app.post('/thread/:id/reply', handleThreadReply);

};



/*	

var threadsobject = {
	subject: 'how do i make an html page',
	message: 'Oh Shit, it's a forum',
	author: 'brandon' //username
	timestamp: 47474848
	replies: replyarray

};

*/
