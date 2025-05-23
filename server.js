const app = require('./src/app'); // Nhập ứng dụng Express từ file app.js trong thư mục src
const { setupClocksTable } = require('./src/models/Clock'); // Nhập hàm setupClocksTable từ file Clock.js trong thư mục models
// Hàm setupClocksTable dùng để kiểm tra hoặc tạo bảng Clocks trong DynamoDB

const PORT = process.env.PORT || 3000; // Định nghĩa cổng chạy server, lấy từ biến môi trường PORT hoặc mặc định là 3000
// Ví dụ: Nếu bạn set PORT=4000 trong .env, server sẽ chạy trên cổng 4000

// Tạo hoặc kiểm tra bảng trước khi khởi động server
setupClocksTable() // Gọi hàm setupClocksTable để đảm bảo bảng Clocks đã sẵn sàng trong DynamoDB
  .then(() => { // Nếu bảng được tạo hoặc kiểm tra thành công (Promise resolved)
    app.listen(PORT, () => { // Khởi động server Express trên cổng PORT
      console.log(`Server is running on port ${PORT}`); // In thông báo server đang chạy
    });
  })
  .catch((error) => { // Nếu có lỗi khi tạo/kiểm tra bảng (Promise rejected)
    console.error('Error starting server:', error); // In lỗi ra console để debug
  });