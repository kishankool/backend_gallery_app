const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { Readable } = require('stream');
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

const listFiles = async (req, res) => {
  const userId = req.params.userId;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${userId}/`,
  };

  try {
    const data = await s3.send(new ListObjectsV2Command(params));
    const mediaFiles = [];

    for (const item of data.Contents) {
      const fileKey = item.Key;
      const fileType = getFileType(fileKey);

      // Generate a signed URL that expires in 1 hour
      const getCommand = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
      });

      const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 }); // 1 hour expiry

      mediaFiles.push({
        url: signedUrl,
        type: fileType,
      });
    }

    res.status(200).json(mediaFiles);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: error.message });
  }
};

// Function to get file type based on file extension
const getFileType = (key) => {
  const extension = key.split('.').pop().toLowerCase();
  if (extension === 'mp4' || extension === 'mov' || extension === 'avi') {
    return 'video';
  } else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
    return 'image';
  }
  // Add more types as needed
  return 'unknown';
};


module.exports = { uploadFile, listFiles, upload: upload.single('media') };
