const { addCar, getAllCars, deleteCar } = require('../models/Car'); // Nhập các hàm từ file model Car
const { uploadToS3 } = require('../config/s3'); // Nhập hàm upload file lên S3 từ config

// Hiển thị danh sách xe (render view)
const getCarsView = async (req, res) => { // Hàm xử lý yêu cầu GET để hiển thị danh sách xe
  try { // Bắt đầu khối try để xử lý lỗi
    const data = await getAllCars(); // Gọi hàm lấy tất cả xe từ DynamoDB
    res.render('index', { cars: data.Items || [] }); // Render view 'index' với danh sách xe (nếu không có xe thì trả về mảng rỗng)
  } catch (error) { // Xử lý lỗi nếu có
    res.status(500).send('Error fetching cars: ' + error.message); // Trả về lỗi 500 với thông báo chi tiết
  }
};

// Thêm dòng xe (API)
const addCarController = async (req, res) => { // Hàm xử lý yêu cầu POST để thêm xe mới
  try { // Bắt đầu khối try để xử lý lỗi
    const { carId, name, type, price } = req.body; // Lấy dữ liệu từ body của request (form hoặc JSON)
    const file = req.file; // Lấy file hình ảnh từ multer (middleware xử lý upload file)

    // Kiểm tra ràng buộc
    if (!carId || !name || !type || !price || !file) { // Kiểm tra xem các trường bắt buộc có bị thiếu không
      return res.status(400).json({ error: 'All fields are required, including an image' }); // Trả về lỗi 400 nếu thiếu
    }
    if (price <= 0) { // Kiểm tra giá có hợp lệ không
      return res.status(400).json({ error: 'Price must be greater than 0' }); // Trả về lỗi 400 nếu giá <= 0
    }

    // Upload hình ảnh lên S3
    const uploadResult = await uploadToS3(file); // Gọi hàm upload file lên S3, trả về kết quả (bao gồm Key)
    const imageUrl = `${process.env.CLOUDFRONT_URL}/${uploadResult.Key}`; // Tạo URL hình ảnh từ CloudFront (CDN)

    // Lưu thông tin xe vào DynamoDB
    const car = { // Tạo object chứa thông tin xe
      carId, // ID của xe
      name, // Tên xe
      type, // Loại xe
      price: Number(price), // Giá xe (chuyển sang số)
      image: imageUrl, // URL hình ảnh từ CloudFront
    };
    await addCar(car); // Gọi hàm thêm xe vào DynamoDB
    res.status(201).json({ message: 'Car added successfully', car }); // Trả về mã 201 (tạo thành công) và thông tin xe
  } catch (error) { // Xử lý lỗi nếu có
    res.status(500).json({ error: error.message }); // Trả về lỗi 500 với thông báo chi tiết
  }
};

// Xóa dòng xe (API)
const deleteCarController = async (req, res) => { // Hàm xử lý yêu cầu DELETE để xóa xe
  try { // Bắt đầu khối try để xử lý lỗi
    const { carId } = req.params; // Lấy carId từ tham số URL (ví dụ: /cars/123)
    await deleteCar(carId); // Gọi hàm xóa xe từ DynamoDB dựa trên carId
    res.status(200).json({ message: 'Car deleted successfully' }); // Trả về mã 200 (thành công) và thông báo
  } catch (error) { // Xử lý lỗi nếu có
    res.status(500).json({ error: error.message }); // Trả về lỗi 500 với thông báo chi tiết
  }
};

module.exports = { getCarsView, addCarController, deleteCarController }; // Xuất các hàm để dùng trong router hoặc file khác