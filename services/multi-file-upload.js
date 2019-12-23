const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const config = require('../configuration/config')

aws.config.update({
    secretAccessKey: config.awsAccessKey,
    accessKeyId: config.awsAccountId,
    region: 'us-east-1'
});

const s3 = new aws.S3()

function checkFileType( file, cb ){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
    if( mimetype && extname ){
        return cb( null, true );
    } else {
        cb( 'Error: Images Only!' );
    }
}

const uploadsBusinessGallery = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        bucket: 'image-upload-28',
        key: function (req, file, cb) {
            cb( null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
        }
    }),
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
        checkFileType( file, cb );
    }
}).array( 'galleryImage', 4 );

module.exports = uploadsBusinessGallery;