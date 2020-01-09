const express = require('express')
    , cleansite = express.Router()
    , pool    = require('../database/pool.js')
    , nodemailer = require('nodemailer')

cleansite.post('/', function (req, res) {
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
        var cs_logo = req.param('cs_logo','unknown')
        var cs_description  =req.param('cs_description','unknown')
        var cs_lat = req.param('cs_lat','unknown')
        var cs_long = req.param('cs_long','unknown')
        var cs_address_name = req.param('cs_address_name','unknown')
        var cs_address = req.param('cs_address','unknown')
        var cs_start_time = req.param('cs_start_time','unknown')
        var cs_end_time = req.param('cs_end_time','unknown')
        var cs_owner = req.param('cs_owner',null)
        var cs_social_owner = req.param('cs_social_owner',null)
        var cs_owner_name = req.param('cs_owner_name',null)
        var cs_owner_description = req.param('cs_owner_description',null)

        // var cs_owner = 'test_acc1@gmail.com'
        var cs_agenda = req.param('cs_agenda','unknown')
        var cs_inex = req.param('cs_inex','unknown')
        var cs_ptcp_no = req.param('cs_ptcp_no','0')

        var cs_amount_collected = req.param('cs_amount_collected','0')
        var cs_organic = req.param('cs_organic','0')
        var cs_recy = req.param('cs_recy','0')
        var cs_non_recy = req.param('cs_non_recy','0')
        var cs_xs_shirt = req.param('cs_xs_shirt','0')
        var cs_s_shirt = req.param('cs_s_shirt','0')
        var cs_m_shirt = req.param('cs_m_shirt','0')
        var cs_l_shirt = req.param('cs_l_shirt','0')
        var cs_xl_shirt = req.param('cs_xl_shirt','0')
        var cs_rq_set = req.param('cs_rq_set','0')
        var cs_pay = req.param('cs_pay',false)

        var insertQuery = "INSERT INTO clean_site (clean_site_id, cs_name, cs_logo, cs_description, cs_lat, cs_long," +
            " cs_address_name, cs_address, cs_start_time, cs_end_time, cs_owner, cs_social_owner, cs_owner_name, cs_owner_description, cs_agenda, cs_inex," +
            " cs_ptcp_no, cs_amount_collected, cs_organic, cs_recy, cs_non_recy, cs_xs_shirt, cs_s_shirt, cs_m_shirt, cs_l_shirt, cs_xl_shirt," +
            " cs_rq_set, cs_pay)" +
            " VALUES ('" + clean_site_id + "', '"
            + cs_name + "', '"
            + cs_logo + "', '"
            + cs_description + "', '"
            + cs_lat +  "', '"
            + cs_long + "', '"
            + cs_address_name + "', '"
            + cs_address + "', '"
            + cs_start_time + "', '"
            + cs_end_time + "', "
            + cs_owner + ", "
            + cs_social_owner + ", '"
            + cs_owner_name + "', '"
            + cs_owner_description + "', '"
            + cs_agenda + "', '"
            + cs_inex + "', '"
            + cs_ptcp_no +  "', '"
            + cs_amount_collected + "', '"
            + cs_organic +  "', '"
            + cs_recy +  "', '"
            + cs_non_recy +  "', '"
            + cs_xs_shirt +  "', '"
            + cs_s_shirt +  "', '"
            + cs_m_shirt +  "', '"
            + cs_l_shirt +  "', '"
            + cs_xl_shirt +  "', '"
            + cs_rq_set + "', "
            + cs_pay
            +")";


        if (cs_owner != null) {
            connection.query("SELECT * FROM social_user WHERE user_id = " + cs_owner, function (err, result, fields) {
                if(result.length == 0) {
                    connection.query("SELECT * FROM users WHERE acc_id = " + cs_owner, function (err, result2, fields) {
                        if (err) throw err;
                        cs_owner_name = result2[0].user_name
                        cs_owner_description = result2[0].user_description
                        connection.query(insertQuery, function (err, result3) {
                            connection.release();
                            if (err) throw err;
                            res.send(result3)
                        });

                    });
                } else {
                    cs_owner_name = result[0].acc_username
                    cs_owner_description = result[0].acc_description
                    connection.query(insertQuery, function (err, result3) {
                        connection.release();
                        if (err) throw err;
                        res.send(result3)
                    });
                }
                connection.release();
                if (err) throw err;

            });
        }


    });
});

cleansite.get('/all', function (req, res) {
    console.log("Hi")
    pool.getConnection(function (err, connection) {
        console.log("JI")
        if (err) throw err;
        console.log("JO")
        new_query = "SELECT * FROM clean_site"
        connection.query(new_query, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });

});

cleansite.get('/bye', function (req, res) {
    res.send("Byeeeeeeeeeeeeeeee")
});

cleansite.get('/all/amount', function (req, res) {
    /**
     * SUM TRASH COLLECTED BY ALL TIME
     */
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

cleansite.get('/countvolunteer', function (req, res) {
    /**
     * COUNT TOTAL VOLUNTEER
     */
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

cleansite.post('/delete/:id' , function (req, res) {
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

cleansite.get('/:id', function (req, res) {
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

cleansite.put('/:id' ,function (req, res) {
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
        var cs_description  = req.param('cs_description','unknown')
        var cs_lat = req.param('cs_lat','unknown')
        var cs_long = req.param('cs_long','unknown')
        var cs_address_name = req.param('cs_address_name','unknown')
        var cs_address = req.param('cs_address','unknown')
        var cs_start_time = req.param('cs_start_time','unknown')
        var cs_end_time = req.param('cs_end_time','unknown')
        var cs_owner_name = req.param('cs_owner_name','unknown')
        var cs_owner_description = req.param('cs_owner_description','unknown')
        var cs_agenda = req.param('cs_agenda','unknown')
        var cs_inex = req.param('cs_inex','unknown')
        var cs_ptcp_no = req.param('cs_ptcp_no','0')

        var cs_amount_collected = req.param('cs_amount_collected','0')

        var cs_organic = req.param('cs_organic','0')
        var cs_recy = req.param('cs_recy','0')
        var cs_non_recy = req.param('cs_non_recy','0')
        var cs_xs_shirt = req.param('cs_xs_shirt','0')
        var cs_s_shirt = req.param('cs_s_shirt','0')
        var cs_m_shirt = req.param('cs_m_shirt','0')
        var cs_l_shirt = req.param('cs_l_shirt','0')
        var cs_xl_shirt = req.param('cs_xl_shirt','0')
        var cs_rq_set = req.param('cs_rq_set','0')
        var cs_pay = req.param('cs_pay',false)

        connection.query("UPDATE clean_site SET cs_name = '" + cs_name
            + "', cs_description = '" + cs_description
            + "', cs_lat = '" + cs_lat
            + "', cs_long = '" + cs_long
            + "', cs_address_name = '" + cs_address_name
            + "', cs_address = '" + cs_address
            + "', cs_start_time = '" + cs_start_time
            + "', cs_end_time = '" + cs_end_time
            + "', cs_owner_name = '" + cs_owner_name
            + "', cs_owner_description = '" + cs_owner_description
            + "', cs_agenda = '" + cs_agenda
            + "', cs_inex = '" + cs_inex
            + "', cs_ptcp_no = '" + cs_ptcp_no
            + "', cs_amount_collected = '" + cs_amount_collected
            + "', cs_organic = '" + cs_organic
            + "', cs_recy = '" + cs_recy
            + "', cs_non_recy = '" + cs_non_recy
            + "', cs_xs_shirt = '" + cs_xs_shirt
            + "', cs_s_shirt = '" + cs_s_shirt
            + "', cs_m_shirt = '" + cs_m_shirt
            + "', cs_l_shirt = '" + cs_l_shirt
            + "', cs_xl_shirt = '" + cs_xl_shirt
            + "', cs_rq_set = '" + cs_rq_set
            + "', cs_pay = " + cs_pay
            + " WHERE clean_site_id = '" + id + "'", (error, results, fields) => {
            connection.release();
            if (error)
                return console.error(error.message);
            res.send('Update Row(s)');
        });
    });
});

cleansite.get('/:id/volunteer', function (req, res) {
    /**
     * GET VOLUNTEER BY SITE ID
     */
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

cleansite.post('/:id/mailvolunteer', function (req, res) {
    /**
     * GET VOLUNTEER BY SITE ID
     */
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var id = req.params.id
        console.log("Sending Email")
        connection.query("SELECT * FROM volunteer, (SELECT sv_volunteer as volunteer_id FROM site_vlt WHERE sv_site = '" + id + "') as site_volunteer WHERE volunteer.vlt_email = site_volunteer.volunteer_id", function (err, results, fields) {
            connection.query("SELECT * FROM clean_site WHERE clean_site_id = '" + id + "'", function (err, site_result, fields) {
                results.forEach(function(result) {
                    mailing(result,site_result)
                });
            });
            console.log("Emails Sent")
            connection.release();
            if (err) throw err;
            res.send(results)
        });
    });
});

cleansite.get('/:id/countvolunteer', function (req, res) {
    /**
     * COUNT VLT BY SITE
     */
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

cleansite.get('/:id/amount', function (req, res) {
    /**
     * SUM TRASH COLLECTED BY ALL TIME
     */
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

cleansite.get('/:id/volunteer/download', function (req, res) {
    /**
     * DOWNLOAD VLT BY SITE
     */
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

function mailing( vlt_result, site_result ){
    const new_mail = "Thân gửi " +  vlt_result.vlt_name + ", \n" +
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
        to: 'vinzeroy28@gmail.com',
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

module.exports = cleansite;


