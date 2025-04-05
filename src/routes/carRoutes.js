const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getCarsView,
  addCarController,
  deleteCarController,
} = require('../controllers/carController');

// Cấu hình multer để xử lý upload file
const upload = multer({ storage: multer.memoryStorage() });

// Route hiển thị giao diện
router.get('/', getCarsView);

// API routes
router.post('/api/cars', upload.single('image'), addCarController); // Thêm xe (với upload hình ảnh)
router.delete('/api/cars/:carId', deleteCarController); // Xóa xe

module.exports = router;