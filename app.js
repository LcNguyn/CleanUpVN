const express           =   require('express')
    , session           =   require('express-session')
    , cookieParser      =   require('cookie-parser')
    , cors              =   require('cors')
    , { google }        =   require('googleapis')
    , passport          =   require('passport')
    , bodyParser        =   require('body-parser')
    , config            =   require('./configuration/config')
    , FacebookStrategy  =   require('passport-facebook').Strategy
    , mysql             =   require('mysql')
    , OAuth2Data        =   require('./configuration/google_key.json')
    , path              =   require('path')
    , downloadsFolder   =   require('downloads-folder')
    , CLIENT_ID         =   OAuth2Data.web.client_id
    , CLIENT_SECRET     =   OAuth2Data.web.client_secret
    , REDIRECT_URL      =   OAuth2Data.web.redirect_uris
    , main              =   express()
    , Users             =   require('./routes/Users')
    , fileRoutes        =   require("./routes/file-upload.js")
    , multiFileRoutes   =   require( './routes/multi-file-upload.js' )
    , cleansite         =   require( './routes/cleansite.js' )
    , account           =   require( './routes/account.js' )
    , volunteer         =   require( './routes/volunteer.js' )
    , site_volunteer    =   require( './routes/site_volunteer.js' )

main.use(express.static(path.join(__dirname,"/build")));
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));
main.use(cors())

var port = process.env.PORT || 8081;

// set port
main.listen(port, 'localhost', function () {
    console.log('Node main is running ' + port);
});
module.exports = main;

var pool        = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : 'localhost',
    user            : 'root',
    password        : 'Wilny28121999',
    database        : 'sakila'
});

// var pool = mysql.createPool({
//     connectionLimit: 10, // default = 10
//     host: process.env.RDS_HOSTNAME,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     port: process.env.RDS_PORT,
//     database: 'ebdb'
// });



// Passport session setup.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
        clientID: config.facebook_api_key,
        clientSecret:config.facebook_api_secret ,
        callbackURL: config.callback_url
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function (res) {
            //Check whether the User exists or not using profile.id
            if(config.use_database) {
                // if sets to true
                pool.query("SELECT * from social_user where user_id="+ profile.id, (err,rows) => {
                    if(err) throw err;
                    if(rows && rows.length === 0) {
                        console.log("There is no such user, adding now");
                        pool.query("INSERT into social_user (user_id,user_name) VALUES ('"+ profile.id +"','"+ profile.displayName +"')");
                            // , function (err, result, fields) {
                            // connection.release();
                            console.log("Done")
                            // if (err) throw err;
                            // res.json({ "authorize": "true" })
                        // })

                    } else {
                        console.log("User already exists in database");
                    }
                });
            }
            return done(null, profile);
        });
    }
));

main.set('views', __dirname + '/views');
main.set('view engine', 'ejs');
main.use(cookieParser());
main.use(bodyParser.urlencoded({ extended: false }));
main.use(session({ secret: 'keyboard cat', key: 'sid'}));
main.use(passport.initialize());
main.use(passport.session());
main.use(express.static(__dirname + '/public'));

main.get('/fblogin', function(req, res){
    res.render('index', { user: req.user });
});

main.get('/fbaccount', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

main.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));

main.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect : '/fblogin', failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/fblogin');
    });

main.get('/logout', function(req, res){
    req.logout();
    res.redirect('/fblogin');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/fblogin')
}

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;
const oAuth2Clientplus = google.plus({ version: 'v1', oAuth2Client });

main.get('/gmaillogin', (req, res) => {
    if (!authed) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/gmail.readonly'
        });
        console.log(url)
        res.redirect(url);
    } else {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const gmail2 = google.plus({ version: 'v1', auth: oAuth2Client });
        // gmail.users.labels.list({
        //     userId: 'me',
        //
        // }, (err, res) => {
        //     // const userGoogleId = me.data.id;
        //     // console.log(userGoogleId)
        //     if (err) return console.log('The API returned an error: ' + err);
        //     const labels = res.data.labels;
        //     if (labels.length) {
        //         console.log('Labels:');
        //         labels.forEach((label) => {
        //             console.log(`- ${label.name}`);
        //         });
        //     } else {
        //         console.log('No labels found.');
        //     }
        // });
        gmail.users.getProfile({
            auth: oAuth2Client,
            userId: 'me'
        }, function(err, res) {
            pool.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query("SELECT * from social_user where user_id= '"+ res.data.emailAddress + "'", (err,rows) => {
                    if(err) throw err;
                    if(rows && rows.length === 0) {
                        console.log("There is no such user, adding now");
                        connection.query("INSERT into social_user (user_id,user_name) VALUES ('"+ res.data.emailAddress +"','"+ res.data.emailAddress +"')");
                        console.log("Done")
                        res.json({ "authorize": "true" })
                    } else {
                        console.log("User already exists in database");
                        res.json({ "authorize": "true" })
                    }
                });
            });

        });
        res.send('Logged in')
    }
})

main.use('/users', Users)
main.use('/image/', fileRoutes)
main.use( '/multiimage/', multiFileRoutes );
main.use('/cleansite/', cleansite);
main.use('/account/', account);
main.use('/volunteer/', volunteer);
main.use('/sitevolunteer/', site_volunteer);

main.get("/*", (req,res) => {
    res.sendFile(path.join(__dirname,"build/index.html"))
})