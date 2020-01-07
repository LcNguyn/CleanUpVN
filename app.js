const express           =   require('express')
    , session           =   require('express-session')
    , cookieParser      =   require('cookie-parser')
    , cors              =   require('cors')
    , passport          =   require('passport')
    , bodyParser        =   require('body-parser')
    , path              =   require('path')
    , app              =   express()
    , Users             =   require('./routes/Users')
    , photo_upload      =   require( './routes/photo_upload.js' )
    , cleansite         =   require( './routes/cleansite.js' )
    , account           =   require( './routes/account.js' )
    , volunteer         =   require( './routes/volunteer.js' )
    , site_volunteer    =   require( './routes/site_volunteer.js' )
    , social_login      =   require( './routes/social_login.js')

app.use(express.static(path.join(__dirname,"/build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors())
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// var port = process.env.PORT || 9003;
//
// // set port
// app.listen(port, 'localhost', function () {
//     console.log('Node main is running ' + port);
// });

app.get("/", (req, res) => res.send(`Hello World2svsdv3123!`));

app.listen(3000, () => {
    console.log(`Example app listening on port 3000!`);
});

module.exports = app;

// var pool = mysql.createPool({
//     connectionLimit: 10, // default = 10
//     host: process.env.RDS_HOSTNAME,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     port: process.env.RDS_PORT,
//     database: 'ebdb'
// });


app.use('/sociallogin', social_login)
app.use('/users', Users)
app.use( '/photo/', photo_upload );
app.use('/cleansite/', cleansite);
app.use('/account/', account);
app.use('/volunteer/', volunteer);
app.use('/sitevolunteer/', site_volunteer);


app.get('/bye', function (req, res) {
    res.send("Byeeeeeeeeeeeeeeee")
});

app.get("/*", (req,res) => {
    res.sendFile(path.join(__dirname,"build/index.html"))
})