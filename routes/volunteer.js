const express = require('express')
    , volunteer = express.Router()
    , pool    = require('../database/pool.js')

volunteer.post('/' , function (req, res) {
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

volunteer.get('/all', function (req, res) {
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

volunteer.post('/delete/:mail' , function (req, res) {
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

volunteer.get('/:mail', function (req, res) {
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

volunteer.put('/:mail' ,function (req, res) {
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

volunteer.get('/signin/:email/:password', function (req, res) {
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

module.exports = volunteer;