// var port = process.env.PORT || 3000,
//     http = require('http'),
//     fs = require('fs'),
//     html = fs.readFileSync('index.html');

// var log = function(entry) {
//     fs.appendFileSync('/tmp/sample-main.log', new Date().toISOString() + ' - ' + entry + '\n');
// };

// var server = http.createServer(function (req, res) {
//     if (req.method === 'POST') {
//         var body = '';

//         req.on('data', function(chunk) {
//             body += chunk;
//         });

//         req.on('end', function() {
//             if (req.url === '/') {
//                 log('Received message: ' + body);
//             } else if (req.url = '/scheduled') {
//                 log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
//             }

//             res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
//             res.end();
//         });
//     } else {
//         res.writeHead(200);
//         res.write(html);
//         res.end();
//     }
// });

// // Listen on port 3000, IP defaults to 127.0.0.1
// server.listen(port);

// // Put a friendly message on the terminal
// console.log('Server running at http://127.0.0.1:' + port + '/');

// var mysql = require('mysql');
// var express = require('express');

const cors = require('cors');

const express           =     require('express')
    , { google }        =     require('googleapis')
    , passport          =     require('passport')
    , FacebookStrategy  =     require('passport-facebook').Strategy
    , session           =     require('express-session')
    , cookieParser      =     require('cookie-parser')
    , bodyParser        =     require('body-parser')
    , config            =     require('./configuration/config')
    , mysql             =     require('mysql')
    , path              =     require('path')
    , OAuth2Data        =     require('./configuration/google_key.json')
    , main              =     express();

main.use(express.static(path.join(__dirname,"/build")));
const downloadsFolder = require('downloads-folder');
const CLIENT_ID     = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL  = OAuth2Data.web.redirect_uris;
const fileRoutes    = require("./routes/file-upload.js")
const multiFileRoutes = require( './routes/multi-file-upload.js' );

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));

main.use(cors())

var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',//smtp.gmail.com  //in place of service use host...
    secure: false,//true
    port: 25,//465
    auth: {
        user: 'cleanupvn@gmail.com',
        pass: 'go123green'
    }, tls: {
        rejectUnauthorized: false
    }
});

var mailOptions = {
    from: 'cleanupvn@gmail.com',
    to: 'willock0928@gmail.com',
    subject: 'Sending Email using Node.js',
    text: "HI"
};

// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });


// let connection = mysql.createConnection({
//     host     : 'aae4ygo6eurjo3.c3e0nzuhohdh.ap-southeast-1.rds.amazonaws.com',
//     user     : 'admin',
//     password : 'locloc123',
//     database : 'ebdb'
// });

// var connection = mysql.createConnection({
//     host: process.env.RDS_HOSTNAME,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     port: process.env.RDS_PORT,
//     database: 'ebdb'
// });

// connection.connect(function(err) {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }
//
//   console.log('Connected to database.');
//
//
// });

// Retrieve all users 
// main.get('/users', function (req, res) {
//     dbConn.query('SELECT * FROM users', function (error, results, fields) {
//         if (error) throw error;
//         return res.send({ error: false, data: results, message: 'users list.' });
//     });
// });

// default route
main.get('/', function (req, res) {
    return res.send({error: true, message: 'hello'})
});

main.get('/bye', function (req, res) {
    return res.send({error: true, message: 'bye'})
});

//CLEANSITE
main.get('/cleansite/all', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        connection.query("SELECT * FROM clean_site", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });

});

main.get('/cleansite/:id', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var id = req.params.id
        connection.query("SELECT * FROM clean_site WHERE clean_site_id = " + id, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });

});

main.post('/cleansite', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        // res.setHeader("Access-Control-Allow-Origin", "http://cleanupvn.ap-southeast-1.elasticbeanstalk.com");
        // res.setHeader("Access-Control-Allow-Credentials", "true");
        // res.setHeader("Access-Control-Allow-Methods", "POST");
        // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        var ALPHABET = '0123456789';

        var ID_LENGTH = 7;

        var generate = function() {
            var rtn = '';
            for (var i = 0; i < ID_LENGTH; i++) {
                rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
            }
            return rtn;
        }
        var clean_site_id =  generate()
        var cs_name = req.param('cs_name','unknown')
        var cs_description  =req.param('cs_description','unknown')
        var cs_lat = req.param('cs_lat','unknown')
        var cs_long = req.param('cs_long','unknown')
        var cs_address = req.param('cs_address','unknown')
        var cs_start_time = req.param('cs_start_time','unknown')
        var cs_end_time = req.param('cs_end_time','unknown')
        var cs_owner = req.param('cs_owner',null)
        var cs_owner_name = req.param('cs_owner_name',null)
        // var cs_owner = 'test_acc1@gmail.com'
        var cs_social_owner = req.param('cs_social_owner',null)
        var cs_social_owner_name = req.param('cs_social_owner',null)

        // var cs_social_owner = 'unknown'

        var cs_amount_collected = req.param('cs_amount_collected','unknown')
        var insertQuery = "INSERT INTO clean_site (clean_site_id, cs_name, cs_description, cs_lat, cs_long, cs_address, cs_start_time, cs_end_time, cs_owner, cs_owner_name, cs_social_owner, cs_social_owner_name, cs_amount_collected)" +
            " VALUES ('" + clean_site_id + "', '" + cs_name + "', '" + cs_description + "', '" + cs_lat +  "', '" + cs_long + "', '" + cs_address + "', '" + cs_start_time + "', '" + cs_end_time + "', " + cs_owner + ", '" + cs_owner_name + "', " + cs_social_owner + ", '" + cs_social_owner_name + "', '" + cs_amount_collected +"')";
        connection.query(insertQuery, function (err, result) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });
});

main.post('/cleansite/delete/:id' , function (req, res) {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Allow-Methods", "POST");
    // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err)
        };
        var id = req.params.id
        connection.query("DELETE FROM clean_site WHERE clean_site_id = " + id, (error, results, fields) => {
            connection.release();
            if (err) throw err;
            res.status(200).send(id.toString());
        });
    });
});

main.put('/cleansite/:id' ,function (req, res) {
    // update statment
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err)
        };
        var id = req.params.id
        var cs_name = req.param('cs_name','unknown')
        var cs_description  =req.param('cs_description','unknown')
        var cs_lat = req.param('cs_lat','unknown')
        var cs_long = req.param('cs_long','unknown')
        var cs_address = req.param('cs_address','unknown')
        var cs_start_time = req.param('cs_start_time','unknown')
        var cs_end_time = req.param('cs_end_time','unknown')
        var cs_amount_collected = req.param('cs_amount_collected','unknown')
        connection.query("UPDATE clean_site SET cs_name = '" + cs_name + "', cs_description = '" + cs_description + "', cs_lat = '" + cs_lat + "', cs_long = '" + cs_long + "', cs_address = '" + cs_address + "', cs_start_time = '" + cs_start_time + "', cs_end_time = '" + cs_end_time + "', cs_amount_collected = '" + cs_amount_collected + "' WHERE clean_site_id = '" + id + "'", (error, results, fields) => {
            connection.release();
            if (error)
                return console.error(error.message);
            res.send('Update Row(s)');
        });
    });
});


//ACCOUNT
main.get('/account/all', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        connection.query("SELECT * FROM users", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });

});

main.get('/account/:id', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var id = req.params.id
        connection.query("SELECT * FROM users WHERE acc_id = " + id , function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });

});

main.post('/account', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var acc_email = req.param('acc_email','unknown')
        var acc_pass = req.param('acc_pass','unknown')
        var acc_username  =req.param('acc_username','unknown')
        var acc_profile_pic = req.param('acc_profile_pic','unknown')

        var insertQuery = "INSERT INTO users (acc_email, acc_pass, acc_username, acc_profile_pic)" +
            " VALUES ('" + acc_email + "', '" + acc_pass + "', '" + acc_username + "', '" + acc_profile_pic +"')";
        connection.query(insertQuery, function (err, result) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });
});

main.post('/account/delete/:id' , function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err)
        };
        var id = req.params.id
        connection.query("DELETE FROM users WHERE acc_id = '" + id + "'", (error, results, fields) => {
            connection.release();
            if (err) throw err;
            res.send('Deleted Row(s)');
        });
    });
});

main.put('/account/:id' ,function (req, res) {
    // update statment
    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err)
        };
        var id = req.params.id
        var acc_pass = req.param('acc_pass','unknown')
        var acc_username  =req.param('acc_username','unknown')
        var acc_profile_pic = req.param('acc_profile_pic','unknown')
        connection.query("UPDATE volunteer SET acc_pass = '" + acc_pass + "', acc_username = '" + acc_username + "', acc_profile_pic = '" + acc_profile_pic + "' WHERE acc_id = '" + id + "'", (error, results, fields) => {
            connection.release();
            if (error)
                return console.error(error.message);
            res.send('Update Row(s)');
        });
    });
});

//Verify account
main.get('/account/sigin/:email/:password', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var email = req.params.email
        var password = req.params.password
        connection.query("SELECT * FROM users WHERE acc_email = '" + email + "' AND acc_pass = '" + password + "'", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            if(result) {
                res.send(result)
            }
            else {
                res.send("Try Again")
            }
        });
    });

});



//VOLUNTEER
main.get('/volunteer/all', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        connection.query("SELECT * FROM volunteer", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });

});

main.get('/volunteer/:mail', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var mail = req.params.mail
        connection.query("SELECT * FROM volunteer WHERE vlt_email = '" + mail + "'", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });

});

main.post('/volunteer' , function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var vlt_email = req.param('vlt_email','unknown')
        var vlt_name = req.param('vlt_name','unknown')
        var vlt_dob  =req.param('vlt_dob','unknown')
        var vlt_address = req.param('vlt_address','unknown')
        var vlt_profile_pic = req.param('vlt_profile_pic','unknown')
        var insertQuery = "INSERT INTO volunteer (vlt_email, vlt_name, vlt_dob, vlt_address, vlt_profile_pic)" +
            " VALUES ('" + vlt_email + "', '" + vlt_name + "', '" + vlt_dob + "', '" + vlt_address +  "', '" + vlt_profile_pic + "')";
        connection.query(insertQuery, function (err, result) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });
});

main.post('/volunteer/delete/:mail' , function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err)
        };
        var mail = req.params.mail
        connection.query("DELETE FROM volunteer WHERE vlt_email = '" + mail + "'", (error, results, fields) => {
            connection.release();
            if (err) throw err;
            res.status(200).send('Deleted Row(s)');
        });
    });
});

main.put('/volunteer/:mail' ,function (req, res) {
    // update statment
    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err)
        };
        var mail = req.params.mail
        var vlt_name = req.param('vlt_name','unknown')
        var vlt_dob  =req.param('vlt_dob','unknown')
        var vlt_address = req.param('vlt_address','unknown')
        var vlt_profile_pic = req.param('vlt_profile_pic','unknown')
        connection.query("UPDATE volunteer SET vlt_name = '" + vlt_name + "', vlt_dob = '" + vlt_dob + "', vlt_address = '" + vlt_address + "', vlt_profile_pic = '" + vlt_profile_pic + "' WHERE vlt_email = '" + mail + "'", (error, results, fields) => {
            connection.release();
            if (error)
                return console.error(error.message);
            res.send('Update Row(s)');
        });
    });
});

//SITE_VLT
main.get('/sitevolunteer/all', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        connection.query("SELECT * FROM site_vlt", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });
});

main.post('/sitevolunteer', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sv_site = req.param('sv_site','unknown')
        var sv_volunteer  =req.param('sv_volunteer','unknown')

        var insertQuery = "INSERT INTO site_vlt (sv_site, sv_volunteer)" +
            " VALUES ('" + sv_site + "', '" + sv_volunteer + "')";
        connection.query(insertQuery, function (err, result) {
            connection.query("SELECT * FROM volunteer WHERE vlt_email = '" + sv_volunteer + "'", function (err, vlt_result, fields) {
                connection.query("SELECT * FROM clean_site WHERE clean_site_id = '" + sv_site + "'", function (err, site_result, fields) {
                    const new_mail = "Thân gửi " +  vlt_result[0].vlt_name + ", \n" +
                        " Cảm ơn bạn đã tham gia vào sự kiện Clean Up của chúng tôi. \n\n" +
                        " Thông tin chi tiết:\n "+
                        "\t1. Tên sự kiện: \n " + site_result[0].cs_name + "\n" +
                        "\t2. Địa chỉ: \n " + site_result[0].cs_address + "\n" +
                        "\t3. Ngày và Giờ: \n  " + site_result[0].cs_start_time + "\n" +
                        "\t4. Kết thúc vào:\n  " + site_result[0].cs_end_time + "\n" +
                        "Mọi thông tin chi tiết xin liên hệ qua anh Hiếu - 0915209318.\n\n" +
                        "Thân chào,\n" +
                        "Ban tổ chức Clean up Vietnam"
                        connection.release();
                    var mailOptions = {
                        from: 'cleanupvn@gmail.com',
                        to: 'thienhieu215@gmail.com',
                        subject: '[CLEANUP VN] Thank you letter and Reminder ',
                        text: new_mail
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    if (err) throw err;
                    res.send(result)
                });

            });
        });
    });
});

main.post('/sitevolunteer/delete/:siteid/:vltmail' , function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err)
        };
        var siteid = req.params.siteid
        var vltmail = req.params.vltmail
        connection.query("DELETE FROM site_vlt WHERE (sv_site = " + siteid + ") AND (sv_volunteer = '" + vltmail + "')" , (error, results, fields) => {
            connection.release();
            if (err) throw err;
            res.status(200).send('Deleted Row(s)');
        });
    });
});


//QUERIES

//Get volunteer by clean site
main.get('/site/:id/volunteer', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        var id = req.params.id
        connection.query("SELECT vlt_email, vlt_name, vlt_dob, vlt_profile_pic FROM volunteer, (SELECT sv_volunteer as volunteer_id FROM site_vlt WHERE sv_site = '" + id + "') as site_volunteer WHERE volunteer.vlt_email = site_volunteer.volunteer_id", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });
});

//Count volunteer by clean site
main.get('/site/:id/countvolunteer', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        var id = req.params.id
        connection.query("SELECT COUNT(sv_volunteer) as volunteer_counted FROM site_vlt WHERE sv_site = " + id, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });
});

//Count total volunteer
main.get('/site/all/countvolunteer', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        var id = req.params.id
        connection.query("SELECT COUNT(vlt_email) as volunteer_counted FROM volunteer", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });
});

//Sum trashed collected by all time
main.get('/site/:id/amount', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        var id = req.params.id
        connection.query("SELECT cs_amount_collected FROM clean_site WHERE clean_site_id = " + id, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });
});

//Sum trashed collected by all time
main.get('/site/all/amount', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        var id = req.params.id
        connection.query("SELECT SUM(cs_amount_collected) as amounted_counted FROM clean_site", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });
});

//Get events by account
main.get('/account/:id/ownevent', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var id = req.params.id
        connection.query("SELECT * FROM clean_site WHERE cs_owner = '" + id + "' OR cs_social_owner = '" + id + "'", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });

});

//Download events by account
main.get('/account/:id/ownevent/download', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var id = req.params.id
        connection.query("SELECT * FROM clean_site WHERE cs_owner = '" + id + "' OR cs_social_owner = '" + id + "'", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            const fs = require('fs');

            var json2xls = require('json2xls');
            var json = result

            var xls = json2xls(json);
            var dateTime = require('node-datetime');
            var dt = dateTime.create();
            dt.format('m/d/Y H:M:S');



            var file = dt._created.toString() + '_site.xlsx'

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader("Content-Disposition", "attachment; filename=" + file);


            fs.writeFileSync(  "./uploads/" + file, xls, 'binary');
            var fileLocation = path.join('./uploads',file);
            console.log(fileLocation);
            res.download(fileLocation, file);
        });
    });

});

//Download vlt by site
main.get('/cleansite/:id/volunteer/download', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        var id = req.params.id
        connection.query("SELECT vlt_email, vlt_name, vlt_dob, vlt_profile_pic FROM volunteer, (SELECT sv_volunteer as volunteer_id FROM site_vlt WHERE sv_site = '" + id + "') as site_volunteer WHERE volunteer.vlt_email = site_volunteer.volunteer_id", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            const fs = require('fs');

            var json2xls = require('json2xls');
            var json = result

            var xls = json2xls(json);
            var dateTime = require('node-datetime');
            var dt = dateTime.create();
            dt.format('m/d/Y H:M:S');
            var file = dt._created.toString() + '_volunteer.xlsx'

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader("Content-Disposition", "attachment; filename=" + file);

            fs.writeFileSync(  "./uploads/" + file, xls, 'binary');
            var fileLocation = path.join('./uploads',file);
            console.log(fileLocation);
            res.download(fileLocation, file);
        });
    });
});


// var pool = mysql.createPool({
//     connectionLimit: 10, // default = 10
//     host: process.env.RDS_HOSTNAME,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     port: process.env.RDS_PORT,
//     database: 'ebdb'
// });

// main.get('/cleansites', function (req, res) {
//     pool.getConnection(function (err, connection) {
//         connection.query("SELECT * FROM cleansites", function (err, rows) {
//             connection.release();
//             if (err) throw err;
//
//             console.log(rows.length);
//             res.send(JSON.stringify(rows));
//         });
//     });
// });

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

// router.get('/test/query', function (req, res) {
//     pool.getConnection(function (err, connection) {
//         connection.query("SELECT * FROM tblcomment", function (err, rows) {
//             connection.release();
//             if (err) throw err;

//             console.log(rows.length);
//             res.send(JSON.stringify(rows));
//         });
//     });
// });

// https://github.com/mysqljs/mysql/issues/1213

//Define MySQL parameter in Config.js file.
// const fb_pool = mysql.createPool({
//     host: process.env.RDS_HOSTNAME,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     port: process.env.RDS_PORT,
//     database: 'ebdb'
// });

const fb_pool = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : 'localhost',
    user            : 'root',
    password        : 'Wilny28121999',
    database        : 'sakila'
})

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
                fb_pool.query("SELECT * from social_user where user_id="+ profile.id, (err,rows) => {
                    if(err) throw err;
                    if(rows && rows.length === 0) {
                        console.log("There is no such user, adding now");
                        fb_pool.query("INSERT into social_user (user_id,user_name) VALUES ('"+ profile.id +"','"+ profile.displayName +"')");
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

var Users = require('./routes/Users')


main.use('/users', Users)
main.use('/image/', fileRoutes)
main.use( '/multiimage/', multiFileRoutes );


main.get("/*", (req,res) => {
    res.sendFile(path.join(__dirname,"build/index.html"))
})