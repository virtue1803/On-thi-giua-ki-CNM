const app = require('./src/app');
const { setupCarsTable } = require('./src/models/Car');

const PORT = process.env.PORT || 3000;

// Tạo hoặc kiểm tra bảng trước khi khởi động server
setupCarsTable()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error starting server:', error);
  });