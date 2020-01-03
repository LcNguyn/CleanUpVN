const express = require("express")
    , photo_upload = express.Router()
    , pool    = require('../database/pool.js')
    , uploadsphoto = require('../services/photo_upload.js');

// const multiUpload = uploadsBusinessGallery.single('image2');
photo_upload.get('/owner/:id/photo', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var id = req.params.id
        connection.query("SELECT * FROM photo WHERE p_owner = " + id, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });

});

photo_upload.post('/profile/:ownerid/upload', ( req, res ) => {
    uploadsphoto( req, res, ( error ) => {
        console.log( 'files', req.files );
        if( error ){
            console.log( 'errors', error );
            res.json( { error: error } );
        } else {
            // If File not found
            if( req.files === undefined ){
                console.log( 'Error: No File Selected!' );
                res.json( 'Error: No File Selected' );
            } else {
                // If Success
                let fileArray = req.files,
                    fileLocation;
                const PhotoLocationArray = [];
                var acc_id = req.params.ownerid;


                for ( let i = 0; i < fileArray.length; i++ ) {
                    fileLocation = fileArray[ i ].location;
                    console.log( 'File Location:', fileLocation );
                    PhotoLocationArray.push( fileLocation )
                    pool.getConnection(function (err, connection) {
                        if (err) throw err;
                        var ALPHABET = '0123456789';

                        var acc_profile_pic = fileLocation

                        var insertQuery = "UPDATE `users` SET `acc_profile_pic` = '"+ acc_profile_pic + "' WHERE (`acc_id` = '"+ acc_id+"');"

                        connection.query(insertQuery, function (err, result) {
                            connection.release();
                            if (err) throw err;
                        });
                    });

                }
                // Save the file name into database
                res.json( {
                    filesArray: fileArray,
                    locationArray: PhotoLocationArray
                } );
            }
        }
    });
});

photo_upload.get('/site/:id/photo', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var id = req.params.id
        connection.query("SELECT * FROM photo WHERE p_event = " + id, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result)
        });
    });

});

photo_upload.post('/basic/:ownerid/:siteid/upload', ( req, res ) => {
    uploadsphoto( req, res, ( error ) => {
        console.log( 'files', req.files );
        if( error ){
            console.log( 'errors', error );
            res.json( { error: error } );
        } else {
            // If File not found
            if( req.files === undefined ){
                console.log( 'Error: No File Selected!' );
                res.json( 'Error: No File Selected' );
            } else {
                // If Success
                let fileArray = req.files,
                    fileLocation;
                const PhotoLocationArray = [];
                var p_event = req.params.siteid;
                var p_owner = req.params.ownerid;


                for ( let i = 0; i < fileArray.length; i++ ) {
                    fileLocation = fileArray[ i ].location;
                    console.log( 'File Location:', fileLocation );
                    PhotoLocationArray.push( fileLocation )
                }

                for ( let i = 0; i < PhotoLocationArray.length; i++ ) {
                    pool.getConnection(function (err, connection) {
                        if (err) throw err;
                        // res.setHeader("Access-Control-Allow-Origin", "http://cleanupvn.ap-southeast-1.elasticbeanstalk.com");
                        // res.setHeader("Access-Control-Allow-Credentials", "true");
                        // res.setHeader("Access-Control-Allow-Methods", "POST");
                        // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
                        var ALPHABET = '0123456789';

                        var ID_LENGTH = 8;

                        var generate = function() {
                            var rtn = '';
                            for (var i = 0; i < ID_LENGTH; i++) {
                                rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
                            }
                            return rtn;
                        }
                        var p_id =  generate()
                        var p_url = PhotoLocationArray[i]


                        var insertQuery = "INSERT INTO photo (p_id, p_url, p_owner, p_event)" +
                            " VALUES ('" + p_id + "', '"
                            + p_url + "', "
                            + p_owner + ", "
                            + p_event +")";
                        connection.query(insertQuery, function (err, result) {
                            connection.release();
                            if (err) throw err;
                        });

                    });
                }



                // Save the file name into database
                res.json( {
                    filesArray: fileArray,
                    locationArray: PhotoLocationArray
                } );
            }
        }
    });
});

photo_upload.post('/social/:ownerid/:siteid/upload', ( req, res ) => {
    uploadsphoto( req, res, ( error ) => {
        console.log( 'files', req.files );
        if( error ){
            console.log( 'errors', error );
            res.json( { error: error } );
        } else {
            // If File not found
            if( req.files === undefined ){
                console.log( 'Error: No File Selected!' );
                res.json( 'Error: No File Selected' );
            } else {
                // If Success
                let fileArray = req.files,
                    fileLocation;
                const PhotoLocationArray = [];
                var p_event = req.params.siteid;
                var p_social_owner = req.params.ownerid;


                for ( let i = 0; i < fileArray.length; i++ ) {
                    fileLocation = fileArray[ i ].location;
                    console.log( 'File Location:', fileLocation );
                    PhotoLocationArray.push( fileLocation )

                }

                for ( let i = 0; i < PhotoLocationArray.length; i++ ) {
                    pool.getConnection(function (err, connection) {
                        if (err) throw err;
                        // res.setHeader("Access-Control-Allow-Origin", "http://cleanupvn.ap-southeast-1.elasticbeanstalk.com");
                        // res.setHeader("Access-Control-Allow-Credentials", "true");
                        // res.setHeader("Access-Control-Allow-Methods", "POST");
                        // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
                        var ALPHABET = '0123456789';

                        var ID_LENGTH = 8;

                        var generate = function() {
                            var rtn = '';
                            for (var i = 0; i < ID_LENGTH; i++) {
                                rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
                            }
                            return rtn;
                        }
                        var p_id =  generate()
                        var p_url = PhotoLocationArray[i]


                        var insertQuery = "INSERT INTO photo (p_id, p_url, p_owner, p_event)" +
                            " VALUES ('" + p_id + "', '"
                            + p_url + "', "
                            + p_owner + ", "
                            + p_event +")";
                        connection.query(insertQuery, function (err, result) {
                            connection.release();
                            if (err) throw err;
                        });

                    });
                }

                // Save the file name into database
                res.json( {
                    filesArray: fileArray,
                    locationArray: PhotoLocationArray
                } );
            }
        }
    });
});

module.exports = photo_upload;