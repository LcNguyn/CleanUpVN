const express           =   require('express')
    , { google }        =   require('googleapis')
    , passport          =   require('passport')
    , config            =   require('../configuration/config.js')
    , FacebookStrategy  =   require('passport-facebook').Strategy
    , OAuth2Data        =   require('../configuration/google_key.json')
    , CLIENT_ID         =   OAuth2Data.web.client_id
    , CLIENT_SECRET     =   OAuth2Data.web.client_secret
    , REDIRECT_URL      =   OAuth2Data.web.redirect_uris
    , social_login      =   express.Router()
    , cors              =   require('cors')
    , pool              =   require('../database/pool.js')
    , bcrypt            =   require('bcryptjs')
    , Social_user       =   require('../models/SocialUser');

const jwt = require('jsonwebtoken')
const scope = [,]
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

var localStorage = require('localStorage')



social_login.use(cors())

process.env.SECRET_KEY = 'secret'

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
        process.nextTick(function () {
            //Check whether the User exists or not using profile.id
            const socialUserData = {
                user_id: profile.id,
                user_name: profile.displayName
            }
            console.log("Token: " + accessToken)
            Social_user.findOne({
                where: {
                    user_id: profile.id
                }
            })
                //TODO bcrypt
                .then(social_user => {
                    if (!social_user) {
                        console.log("There is no such user, adding now");
                        // if(err) throw err;

                        Social_user.create(socialUserData)
                            .then(social_user => {
                                console.log({ status: social_user.user_id + 'Registered!' })
                                var token = jwt.sign(social_user.dataValues, process.env.SECRET_KEY, {
                                    expiresIn: 1440
                                })
                                profile["manualToken"] = token
                                console.log("Profile !!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                                console.log(profile)
                                return done(null, profile);


                            })
                            .catch(err => {
                                console.log('error: ' + err)
                            })
                        // pool.query("INSERT into social_user (user_id,user_name) VALUES ('"+ profile.id +"','"+ profile.displayName +"')");

                        // pool.query("INSERT into social_user (user_id,user_name) VALUES ('"+ profile.id +"','"+ profile.displayName +"')");
                        // , function (err, result, fields) {
                        // connection.release();
                        console.log("Done")

                        // res1.json({ "authorize": "true" })

                        // if (err) throw err;
                        // res.json({ "authorize": "true" })
                        // })

                        // bcrypt.genSalt(10, function(err, salt) {
                        //     bcrypt.hash(req.body.acc_pass, salt, function(err, hash) {
                        //         // Store hash in your password DB.
                        //         userData.acc_pass = hash
                        //         User.create(userData)
                        //             .then(user => {
                        //                 res.json({ status: user.acc_email + 'Registered!' })
                        //             })
                        //             .catch(err => {
                        //                 res.send('error: ' + err)
                        //             })
                        //     });
                        // })
                    } else {
                        console.log("User already exists in database");
                        var token = jwt.sign(social_user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        })
                        profile["manualToken"] = token
                        console.log("Profile !!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                        console.log(profile)
                        return done(null, profile);




                        // console.log(token)
                        // res1.send(token)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            // return done(null, profile);

            // if(config.use_database) {
            // }
            // if sets to true



            // pool.query("SELECT * from social_user where user_id="+ profile.id, (err,rows) => {
            //     if(err) throw err;
            //     if(rows && rows.length === 0) {
            //         console.log("There is no such user, adding now");
            //         pool.query("INSERT into social_user (user_id,user_name) VALUES ('"+ profile.id +"','"+ profile.displayName +"')");
            //         // , function (err, result, fields) {
            //         // connection.release();
            //         console.log("Done")
            //         // if (err) throw err;
            //         // res.json({ "authorize": "true" })
            //         // })
            //
            //     } else {
            //         console.log("User already exists in database");
            //     }
            // });


        });
    }
));

social_login.get('/fbaccount', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

social_login.get('/fblogin', function(req, res){
    console.log("login ne")
    const user = req.user;
    console.log(user)
    if (!user) {
        res.send("Not authenticated")
    } else {
        res.send(user.manualToken)
    }
    // res.render('index', { user: req.user });
});

social_login.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));

social_login.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect : '/#/event-list', failureRedirect: '/#/sign-in' })
    // function(req, res) {
    //     res.redirect('/sociallogin/fblogin');
    // }
    );

social_login.get('/logout', function(req, res){
    req.logout();
    // res.redirect('/#/sign-in');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/fblogin')
}

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;
const oAuth2Clientplus = google.plus({ version: 'v1', oAuth2Client });


social_login.get('/gmaillogin', (req, res) => {

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        var oauth2 = google.oauth2({
            auth: oAuth2Client,
            version: 'v2'
        });

        oauth2.userinfo.v2.me.get(
            function(err, res1) {
                // if (err) {
                //     console.log(err);
                // } else {
                //     console.log(res);
                // }

                const socialUserData = {
                    user_id: res1.data.id,
                    user_name: res1.data.name
                }

                Social_user.findOne({
                    where: {
                        user_id: res1.data.id
                    }
                })
                    //TODO bcrypt
                    .then(social_user => {
                        if (!social_user) {
                            console.log("There is no such user, adding now");
                            // if(err) throw err;
                            Social_user.create(socialUserData)
                                .then(social_user => {
                                    console.log({ status: social_user.user_id + 'Registered!' })
                                })
                                .catch(err => {
                                    console.log('error: ' + err)
                                })
                            // pool.query("INSERT into social_user (user_id,user_name) VALUES ('"+ profile.id +"','"+ profile.displayName +"')");

                            // pool.query("INSERT into social_user (user_id,user_name) VALUES ('"+ profile.id +"','"+ profile.displayName +"')");
                            // , function (err, result, fields) {
                            // connection.release();
                            var token = jwt.sign(social_user.dataValues, process.env.SECRET_KEY, {
                                expiresIn: 1440
                            })
                            res.json({'authorization': 'true','token': token});


                            // res1.json({ "authorize": "true" })

                            // if (err) throw err;
                            // res.json({ "authorize": "true" })
                            // })

                            // bcrypt.genSalt(10, function(err, salt) {
                            //     bcrypt.hash(req.body.acc_pass, salt, function(err, hash) {
                            //         // Store hash in your password DB.
                            //         userData.acc_pass = hash
                            //         User.create(userData)
                            //             .then(user => {
                            //                 res.json({ status: user.acc_email + 'Registered!' })
                            //             })
                            //             .catch(err => {
                            //                 res.send('error: ' + err)
                            //             })
                            //     });
                            // })
                        } else {
                            console.log("User already exists in database");
                            // console.log(token)
                            var token = jwt.sign(social_user.dataValues, process.env.SECRET_KEY, {
                                expiresIn: 1440
                            })
                            res.json({'authorization': 'true','token': token});
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })


                // pool.getConnection(function (err, connection) {
                //     if (err) throw err;
                //     connection.query("SELECT * from social_user where user_id= '"+ res.data.id + "'", (err,rows) => {
                //         if(err) throw err;
                //         if(rows && rows.length === 0) {
                //             console.log("There is no such user, adding now");
                //             connection.query("INSERT into social_user (user_id,user_name) VALUES ('"+ res.data.id +"','"+ res.data.name +"')");
                //             // res.json({ "authorize": "true" })
                //         } else {
                //             console.log("User already exists in database");
                //             // res.json({ "authorize": "true" })
                //         }
                //     });
                // });
            });

        // const gmail2 = google.plus({ version: 'v1', auth: oAuth2Client });
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
        // gmail.users.getProfile({
        //     auth: oAuth2Client,
        //     userId: 'me'
        // }, function(err, res) {
        //
        //     // const socialUserData = {
        //     //     user_id: res.id,
        //     //     user_name: res.name
        //     // }
        //     //
        //     // var ALPHABET = '0123456789';
        //     //
        //     // var ID_LENGTH = 7;
        //     //
        //     // var generate = function() {
        //     //     var rtn = '';
        //     //     for (var i = 0; i < ID_LENGTH; i++) {
        //     //         rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
        //     //     }
        //     //     return rtn;
        //     // }
        //     //
        //     // userData.acc_id =  generate()
        //     //
        //     // User.findOne({
        //     //     where: {
        //     //         acc_email: req.body.acc_email
        //     //     }
        //     // })
        //     //     //TODO bcrypt
        //     //     .then(user => {
        //     //         if (!user) {
        //     //             bcrypt.genSalt(10, function(err, salt) {
        //     //                 bcrypt.hash(req.body.acc_pass, salt, function(err, hash) {
        //     //                     // Store hash in your password DB.
        //     //                     userData.acc_pass = hash
        //     //                     User.create(userData)
        //     //                         .then(user => {
        //     //                             res.json({ status: user.acc_email + 'Registered!' })
        //     //                         })
        //     //                         .catch(err => {
        //     //                             res.send('error: ' + err)
        //     //                         })
        //     //                 });
        //     //             })
        //     //         } else {
        //     //             res.json({ error: 'User already exists' })
        //     //         }
        //     //     })
        //     //     .catch(err => {
        //     //         res.send('error: ' + err)
        //     //     })
        //     console.log(res)
        //
        //
        // });


})

social_login.get('/auth/google', (req, res) => {
            // Generate an OAuth URL and redirect there
            const url = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: 'https://www.googleapis.com/auth/userinfo.profile'
            });
            console.log(url)
            res.redirect(url);
})

social_login.get('/auth/google/callback', function (req, res) {
    const code = req.query.code
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
                res.redirect('/#/sign-in');

            } else {
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);
                authed = true;
                res.redirect('/#/event-list');
            }
        });
    }
});


module.exports = social_login;