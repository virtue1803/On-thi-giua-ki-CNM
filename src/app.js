const express = require('express'); // Nhập thư viện Express để tạo server và xử lý các yêu cầu HTTP
const path = require('path'); // Nhập module path của Node.js để xử lý đường dẫn file
const carRoutes = require('./routes/carRoutes'); // Nhập file router từ thư mục routes để định nghĩa các tuyến đường

const app = express(); // Tạo một instance của Express, đây là ứng dụng chính của bạn

// Cấu hình view engine
app.set('view engine', 'ejs'); // Thiết lập EJS làm view engine để render các file giao diện (template)
app.set('views', path.join(__dirname, 'views')); // Thiết lập thư mục chứa các file view (templates) là 'views' trong thư mục hiện tại
// path.join(__dirname, 'views'): Tạo đường dẫn tuyệt đối tới thư mục views (ví dụ: /project/views)

// Middleware
app.use(express.json()); // Middleware để parse (phân tích) dữ liệu JSON từ body của request (dùng cho API)
app.use(express.urlencoded({ extended: true })); // Middleware để parse dữ liệu từ form (application/x-www-form-urlencoded)
// extended: true cho phép parse các object lồng nhau trong form

// Routes
app.use('/', carRoutes); // Sử dụng router từ carRoutes cho các tuyến đường bắt đầu từ '/' (gốc)
// Tất cả các yêu cầu sẽ được chuyển tới carRoutes để xử lý

module.exports = app; // Xuất ứng dụng Express để sử dụng ở file khác (thường là file chạy server như index.js)