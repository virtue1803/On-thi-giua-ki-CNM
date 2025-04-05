const AWS = require('aws-sdk'); // Nhập thư viện AWS SDK để làm việc với các dịch vụ AWS (như S3, DynamoDB, v.v.)
require('dotenv').config(); // Nhập và chạy dotenv để tải các biến môi trường từ file .env

// Cấu hình S3
const s3 = new AWS.S3({ // Tạo một instance của S3 với thông tin cấu hình
  region: process.env.AWS_REGION, // Vùng AWS (ví dụ: 'us-east-1'), lấy từ biến môi trường AWS_REGION
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Khóa truy cập AWS, lấy từ biến môi trường AWS_ACCESS_KEY_ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Khóa bí mật AWS, lấy từ biến môi trường AWS_SECRET_ACCESS_KEY
});

// Hàm upload file lên S3
const uploadToS3 = (file) => { // Hàm nhận tham số là file (từ multer) để upload lên S3
  const params = { // Cấu hình tham số cho việc upload lên S3
    Bucket: process.env.BUCKET_NAME, // Tên bucket S3, lấy từ biến môi trường BUCKET_NAME trong .env
    Key: `${Date.now()}_${file.originalname}`, // Tên file trên S3, kết hợp thời gian hiện tại và tên gốc để đảm bảo duy nhất
    Body: file.buffer, // Nội dung file (dữ liệu nhị phân), lấy từ buffer của multer
    ContentType: file.mimetype, // Loại nội dung của file (ví dụ: 'image/jpeg'), lấy từ multer
  };

  return s3.upload(params).promise(); // Gọi hàm upload của S3 và trả về Promise chứa kết quả (ví dụ: URL hoặc Key của file)
};

module.exports = { uploadToS3 }; // Xuất hàm uploadToS3 để sử dụng ở các file khác (như controller)