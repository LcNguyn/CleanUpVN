const express = require("express");
const muli_image_router = express.Router();

const uploadsBusinessGallery = require('../services/multi-file-upload.js');

// const multiUpload = uploadsBusinessGallery.single('image2');

muli_image_router.post('/multiple-file-upload', ( req, res ) => {
    uploadsBusinessGallery( req, res, ( error ) => {
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
                const galleryImgLocationArray = [];
                for ( let i = 0; i < fileArray.length; i++ ) {
                    fileLocation = fileArray[ i ].location;
                    console.log( 'filenm', fileLocation );
                    galleryImgLocationArray.push( fileLocation )
                }
                // Save the file name into database
                res.json( {
                    filesArray: fileArray,
                    locationArray: galleryImgLocationArray
                } );
            }
        }
    });
});

module.exports = muli_image_router;