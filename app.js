const express           =   require('express')
    , session           =   require('express-session')
    , cookieParser      =   require('cookie-parser')
    , cors              =   require('cors')
    , passport          =   require('passport')
    , bodyParser        =   require('body-parser')
    , path              =   require('path')
    , main              =   express()
    , Users             =   require('./routes/Users')
    , photo_upload      =   require( './routes/photo_upload.js' )
    , cleansite         =   require( './routes/cleansite.js' )
    , account           =   require( './routes/account.js' )
    , volunteer         =   require( './routes/volunteer.js' )
    , site_volunteer    =   require( './routes/site_volunteer.js' )
    , social_login      =   require( './routes/social_login.js')

main.use(express.static(path.join(__dirname,"/build")));
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));
main.use(cors())
main.set('views', __dirname + '/views');
main.set('view engine', 'ejs');
main.use(cookieParser());
main.use(bodyParser.urlencoded({ extended: false }));
main.use(session({ secret: 'keyboard cat', key: 'sid'}));
main.use(passport.initialize());
main.use(passport.session());
main.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8081;

// set port
main.listen(port, 'localhost', function () {
    console.log('Node main is running ' + port);
});
module.exports = main;

// var pool = mysql.createPool({
//     connectionLimit: 10, // default = 10
//     host: process.env.RDS_HOSTNAME,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     port: process.env.RDS_PORT,
//     database: 'ebdb'
// });


main.use('/sociallogin', social_login)
main.use('/users', Users)
main.use( '/photo/', photo_upload );
main.use('/cleansite/', cleansite);
main.use('/account/', account);
main.use('/volunteer/', volunteer);
main.use('/sitevolunteer/', site_volunteer);

main.get("/*", (req,res) => {
    res.sendFile(path.join(__dirname,"build/index.html"))
})