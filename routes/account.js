const express = require('express')
    , account = express.Router()
    , pool    = require('../database/pool.js')

account.post('/', function (req, res) {
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

account.get('/all', function (req, res) {
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

account.post('/delete/:id' , function (req, res) {
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

account.get('/signin/:email/:password', function (req, res) {
    /**
     * VERIFY ACCOUNT
     */
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

account.get('/:id', function (req, res) {
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

account.put('/:id' ,function (req, res) {
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

account.get('/:id/ownevent', function (req, res) {
    /**
     * GET EVENT BY ACCOUNT
     */
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

account.get('/:id/ownevent/download', function (req, res) {
    /**
     * DOWNLOAD EVENTS BY ACCOUNT
     */
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

module.exports = account;