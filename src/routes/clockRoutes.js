const express = require('express'); // Nhập thư viện Express để tạo server và định tuyến
const router = express.Router(); // Tạo một router để định nghĩa các tuyến đường (routes)
const multer = require('multer'); // Nhập multer để xử lý upload file (ở đây là hình ảnh)
const {
  getClocksView,
  addClockController,
  deleteClockController,
} = require('../controllers/ClockController'); // Nhập các hàm controller từ file ClockController

// Cấu hình multer để xử lý upload file
const upload = multer({ storage: multer.memoryStorage() }); // Cấu hình multer để lưu file vào bộ nhớ tạm (memory) thay vì đĩa
// Ghi chú: multer.memoryStorage() phù hợp khi bạn muốn xử lý file ngay (ví dụ: upload lên S3)

// Route hiển thị giao diện
router.get('/', getClocksView); // Định nghĩa route GET cho đường dẫn gốc ('/'), gọi hàm getClocksView để hiển thị danh sách đồng hồ
// Khi người dùng truy cập '/', danh sách đồng hồ sẽ được render ra view

// API routes
router.post('/api/Clocks', upload.single('image'), addClockController); // Định nghĩa route POST cho '/api/Clocks' để thêm đồng hồ mới
// - upload.single('image'): Middleware multer xử lý upload 1 file với tên trường là 'image'
// - Sau khi upload, gọi addClockController để xử lý logic thêm đồng hồ

router.delete('/api/Clocks/:clockId', deleteClockController); // Định nghĩa route DELETE cho '/api/Clocks/:clockId' để xóa đồng hồ
// - :clockId là tham số động trong URL (ví dụ: /api/Clocks/123), sẽ được truyền vào deleteClockController

module.exports = router; // Xuất router để sử dụng trong file chính (thường là app.js hoặc index.js)