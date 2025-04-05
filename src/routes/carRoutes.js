const express = require('express'); // Nhập thư viện Express để tạo server và định tuyến
const router = express.Router(); // Tạo một router để định nghĩa các tuyến đường (routes)
const multer = require('multer'); // Nhập multer để xử lý upload file (ở đây là hình ảnh)
const {
  getCarsView,
  addCarController,
  deleteCarController,
} = require('../controllers/carController'); // Nhập các hàm controller từ file carController

// Cấu hình multer để xử lý upload file
const upload = multer({ storage: multer.memoryStorage() }); // Cấu hình multer để lưu file vào bộ nhớ tạm (memory) thay vì đĩa
// Ghi chú: multer.memoryStorage() phù hợp khi bạn muốn xử lý file ngay (ví dụ: upload lên S3)

// Route hiển thị giao diện
router.get('/', getCarsView); // Định nghĩa route GET cho đường dẫn gốc ('/'), gọi hàm getCarsView để hiển thị danh sách xe
// Khi người dùng truy cập '/', danh sách xe sẽ được render ra view

// API routes
router.post('/api/cars', upload.single('image'), addCarController); // Định nghĩa route POST cho '/api/cars' để thêm xe mới
// - upload.single('image'): Middleware multer xử lý upload 1 file với tên trường là 'image'
// - Sau khi upload, gọi addCarController để xử lý logic thêm xe

router.delete('/api/cars/:carId', deleteCarController); // Định nghĩa route DELETE cho '/api/cars/:carId' để xóa xe
// - :carId là tham số động trong URL (ví dụ: /api/cars/123), sẽ được truyền vào deleteCarController

module.exports = router; // Xuất router để sử dụng trong file chính (thường là app.js hoặc index.js)