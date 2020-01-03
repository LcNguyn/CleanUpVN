const express = require('express')
    , site_volunteer = express.Router()
    , pool    = require('../database/pool.js')
    , nodemailer = require('nodemailer')

site_volunteer.post('/', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sv_site = req.param('sv_site','unknown')
        var sv_volunteer  = req.param('sv_volunteer','unknown')
        var sv_cleanuptools  = req.param('sv_cleanuptools',false)
        var sv_shirt  = req.param('sv_shirt','unknown')

        console.log(sv_cleanuptools)

        var insertQuery = "INSERT INTO site_vlt (sv_site, sv_volunteer, sv_cleanuptools, sv_shirt)" +
            " VALUES ('" + sv_site + "', '"  + sv_volunteer + "', " + sv_cleanuptools + ", '" + sv_shirt + "')";
        connection.query(insertQuery, function (err, result) {
            connection.query("SELECT * FROM volunteer WHERE vlt_email = '" + sv_volunteer + "'", function (err, vlt_result, fields) {
                connection.query("SELECT * FROM clean_site WHERE clean_site_id = '" + sv_site + "'", function (err, site_result, fields) {

                    mailing(vlt_result, site_result)

                    if (err) throw err;
                    if (sv_shirt == 'XS') {
                        var query_shirt = parseInt(site_result[0].cs_xs_shirt) +1
                        var insertQuery2 = "UPDATE clean_site SET `cs_xs_shirt` = '"+ query_shirt +"' WHERE (`clean_site_id` = '" + sv_site +"')"
                    }
                    if (sv_shirt == 'S') {
                        var query_shirt = parseInt(site_result[0].cs_s_shirt) +1
                        var insertQuery2 = "UPDATE clean_site SET `cs_s_shirt` = '"+ query_shirt +"' WHERE (`clean_site_id` = '" + sv_site +"')"
                    }
                    if (sv_shirt == 'M') {
                        var query_shirt = parseInt(site_result[0].cs_m_shirt) +1
                        var insertQuery2 = "UPDATE clean_site SET `cs_m_shirt` = '"+ query_shirt +"' WHERE (`clean_site_id` = '" + sv_site +"')"
                    }
                    if (sv_shirt == 'L') {
                        var query_shirt = parseInt(site_result[0].cs_l_shirt) +1

                        var insertQuery2 = "UPDATE clean_site SET `cs_l_shirt` = '"+ query_shirt +"' WHERE (`clean_site_id` = '" + sv_site +"')"
                    }
                    if (sv_shirt == 'XL') {
                        var query_shirt = parseInt(site_result[0].cs_xl_shirt) +1
                        var insertQuery2 = "UPDATE clean_site SET `cs_xl_shirt` = '"+ query_shirt +"' WHERE (`clean_site_id` = '" + sv_site +"')"
                    }
                    console.log(insertQuery2)
                    connection.query(insertQuery2, function (err, shirt_result, fields) {
                        if (err) throw err;
                        if (sv_cleanuptools == true) {
                            var query_set = parseInt(site_result[0].cs_rq_set) +1
                            var insertQuery3 = "UPDATE clean_site SET `cs_rq_set` = '"+ query_set +"' WHERE (`clean_site_id` = '" + sv_site +"')"
                        } else {
                            var query_set = parseInt(site_result[0].cs_rq_set)
                            var insertQuery3 = "UPDATE clean_site SET `cs_rq_set` = '"+ query_set +"' WHERE (`clean_site_id` = '" + sv_site +"')"
                        }

                        connection.query(insertQuery3, function (err, shirt_result, fields) {

                            connection.release();

                            if (err) throw err;

                            res.send(shirt_result)
                        });
                    });
                });
            });
        });
    });
});

site_volunteer.get('/all', function (req, res) {
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

site_volunteer.post('/delete/:siteid/:vltmail' , function (req, res) {
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

function mailing( vlt_result, site_result ){
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
        var mailOptions = {
            from: 'cleanupvn@gmail.com',
            to: vlt_result[0].vlt_email,
            subject: '[CLEANUP VN] Thank you letter and Reminder',
            text: new_mail
        };
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
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
}

module.exports = site_volunteer;