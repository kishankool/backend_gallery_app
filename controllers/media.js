const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer-S3 configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (req, file, cb) {
      const userId = req.params.userId;
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, `${userId}/${filename}`);
    },
  }),
});

const uploadFile = async (req, res) => {
  try {
    // Multer will populate req.file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    const fileLocation = req.file.location;
    console.log(fileLocation);
    res.status(200).json({ message: 'File uploaded successfully!', location: fileLocation });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'File not uploaded!', msg: error.message });
  }
};

const listFiles = (req, res) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${req.params.userId}/`,
  };

  s3.send(new ListObjectsV2Command(params), (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    const fileUrls = data.Contents.map((item) => {
      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
    });
    return res.status(200).json(fileUrls);
  });
};

module.exports = { uploadFile, listFiles, upload: upload.single('media') };
