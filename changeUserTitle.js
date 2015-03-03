'use strict';

// Get the command line arguments
var argv = require('minimist')(process.argv);

var User = require('./models/user');

var username = argv.u || argv.user;

var title = argv.t || argv.title || 0;

if (!username) {
  console.log('-u or --user required.');
  return;
}

User.changeTitle(username, title, function(result) {
  console.log(result);
  process.exit();
});
