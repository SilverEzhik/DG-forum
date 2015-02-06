//TODO add bcrypt module
module.exports = function(app, validator, mongoose, moment) {

    var Schema = mongoose.Schema,
        SALT_WORK_FACTOR = 10;

    //user model
    var UserSchema = new Schema({
        username: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        password: {
            type: String,
            required: true
        }
    });

    var User = mongoose.model('User', UserSchema);


    //FUNCTIONS------------------------------------------

    function handleLoginRequest(req, res) {
        //get user and pass from the request
        var username = validator.toString(req.body.username);
        var password = validator.toString(req.body.password);

        var user = new User({
            username: username,
            password: password
        });

        //attempts to find user from db
        User.findOne({
            username: username
        }, function(err, userDB) {
            if (err) throw err;

            if (password == userDB.password) {
                res.redirect('/');
                console.log("logged in as " + username);
            } else {
                //if pass is incorrect, send them back to the login page
                renderLoginPage(req,res, true);
                console.log("username is correct, but password is not");
            }
        });

    }

    function handleRegisterRequest(req, res) {

        var username = validator.toString(req.body.username);
        var password = validator.toString(req.body.password);

        var user = new User({
            username: username,
            password: password
        });

        user.save(function(err) {
            if (err) console.log(err);

            // fetch user and test password verification
            User.findOne({
                username: 'jmar777'
            }, function(err, user) {
                if (err) throw err;




            });
        });

    }

    function renderLoginPage(req, res, wrongPass) {

        User.find(function(err, users) {
            if (err) console.error(err);

            //render template
            res.render('login.html', {
                title: 'Login',
                users: users,
                wrongPass: wrongPass
            });
        });

    }

    app.get('/login', function(req,res){
        renderLoginPage(req,res, false);
    });
    app.post('/login', handleLoginRequest);


};
