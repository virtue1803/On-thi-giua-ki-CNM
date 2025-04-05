const { addCar, getAllCars, deleteCar } = require('../models/Car');
const { uploadToS3 } = require('../config/s3');

// Hiển thị danh sách xe (render view)
const getCarsView = async (req, res) => {
  try {
    const data = await getAllCars();
    res.render('index', { cars: data.Items || [] });
  } catch (error) {
    res.status(500).send('Error fetching cars: ' + error.message);
  }
};

// Thêm dòng xe (API)
const addCarController = async (req, res) => {
  try {
    const { carId, name, type, price } = req.body;
    const file = req.file; // Hình ảnh từ multer

    // Kiểm tra ràng buộc
    if (!carId || !name || !type || !price || !file) {
      return res.status(400).json({ error: 'All fields are required, including an image' });
    }
    if (price <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    // Upload hình ảnh lên S3
    const uploadResult = await uploadToS3(file);
    const imageUrl = `${process.env.CLOUDFRONT_URL}/${uploadResult.Key}`; // URL từ CloudFront

    // Lưu thông tin xe vào DynamoDB
    const car = {
      carId,
      name,
      type,
      price: Number(price),
      image: imageUrl,
    };
    await addCar(car);
    res.status(201).json({ message: 'Car added successfully', car });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa dòng xe (API)
const deleteCarController = async (req, res) => {
  try {
    const { carId } = req.params;
    await deleteCar(carId);
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCarsView, addCarController, deleteCarController };