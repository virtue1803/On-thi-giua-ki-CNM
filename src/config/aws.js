const AWS = require('aws-sdk'); // Nhập thư viện AWS SDK để làm việc với các dịch vụ AWS (như DynamoDB, S3, v.v.)
require('dotenv').config(); // Nhập và chạy dotenv để tải các biến môi trường từ file .env

// Cấu hình AWS
AWS.config.update({ // Cập nhật cấu hình cho AWS SDK
  region: process.env.AWS_REGION, // Vùng AWS (ví dụ: 'us-east-1'), lấy từ biến môi trường AWS_REGION trong file .env
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Khóa truy cập AWS, lấy từ biến môi trường AWS_ACCESS_KEY_ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Khóa bí mật AWS, lấy từ biến môi trường AWS_SECRET_ACCESS_KEY
});

// Tạo instance của DynamoDB
const dynamodb = new AWS.DynamoDB(); // Tạo một instance của DynamoDB (client cấp thấp) để quản lý bảng (tạo, xóa, mô tả bảng, v.v.)
const docClient = new AWS.DynamoDB.DocumentClient(); // Tạo một instance của DocumentClient (client cấp cao) để làm việc với dữ liệu (thêm, lấy, xóa, v.v.)

module.exports = { dynamodb, docClient }; // Xuất hai đối tượng dynamodb và docClient để sử dụng ở các file khác