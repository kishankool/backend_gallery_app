const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();



const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, `users/${req.params.userId}/images/${uuidv4()}-${file.originalname}`);
    }
  })
}).single('file');

const uploadFile = (req, res) => {
  upload(req, res, function (error) {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ fileUrl: req.file.location });
  });
};

const listFiles = (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: `users/${req.params.userId}/images/`
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    const fileUrls = data.Contents.map(item => {
      return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
    });
    return res.status(200).json(fileUrls);
  });
};

module.exports = { uploadFile, listFiles };
