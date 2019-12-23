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

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        bucket: 'image-upload-28',

        metadata: function (req, file, cb) {
            cb(null, {fieldName: 'TESTING'});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

module.exports = upload;