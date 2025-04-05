const AWS = require('aws-sdk');
require('dotenv').config();

// Cấu hình S3
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Hàm upload file lên S3
const uploadToS3 = (file) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`, // Tạo tên file duy nhất
    Body: file.buffer,
    ContentType: file.mimetype,
    
  };

  return s3.upload(params).promise();
};

module.exports = { uploadToS3 };