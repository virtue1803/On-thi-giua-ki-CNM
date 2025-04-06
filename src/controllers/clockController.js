const { addClock, getAllClocks, deleteClock } = require('../models/clock'); // Nhập các hàm từ file model Clock
const { uploadToS3 } = require('../config/s3'); // Nhập hàm upload file lên S3 từ config

// Hiển thị danh sách đồng hồ (render view)
const getClocksView = async (req, res) => { // Hàm xử lý yêu cầu GET để hiển thị danh sách đồng hồ
  try { // Bắt đầu khối try để xử lý lỗi
    const data = await getAllClocks(); // Gọi hàm lấy tất cả đồng hồ từ DynamoDB
    res.render('index', { Clocks: data.Items || [] }); // Render view 'index' với danh sách đồng hồ (nếu không có đồng hồ thì trả về mảng rỗng)
  } catch (error) { // Xử lý lỗi nếu có
    res.status(500).send('Error fetching Clocks: ' + error.message); // Trả về lỗi 500 với thông báo chi tiết
  }
};

// Thêm dòng đồng hồ (API)
const addClockController = async (req, res) => { // Hàm xử lý yêu cầu POST để thêm đồng hồ mới
  try { // Bắt đầu khối try để xử lý lỗi
    const { clockId, name, type, price } = req.body; // Lấy dữ liệu từ body của request (form hoặc JSON)
    const file = req.file; // Lấy file hình ảnh từ multer (middleware xử lý upload file)

    // Kiểm tra ràng buộc
    if (!clockId || !name || !type || !price || !file) { // Kiểm tra đồng hồm các trường bắt buộc có bị thiếu không
      return res.status(400).json({ error: 'All fields are required, including an image' }); // Trả về lỗi 400 nếu thiếu
    }
    if (price <= 0) { // Kiểm tra giá có hợp lệ không
      return res.status(400).json({ error: 'Price must be greater than 0' }); // Trả về lỗi 400 nếu giá <= 0
    }

    // Upload hình ảnh lên S3
    const uploadResult = await uploadToS3(file); // Gọi hàm upload file lên S3, trả về kết quả (bao gồm Key)
    const imageUrl = `${process.env.CLOUDFRONT_URL}/${uploadResult.Key}`; // Tạo URL hình ảnh từ CloudFront (CDN)

    // Lưu thông tin đồng hồ vào DynamoDB
    const Clock = { // Tạo object chứa thông tin đồng hồ
      clockId, // ID của đồng hồ
      name, // Tên đồng hồ
      type, // Loại đồng hồ
      price: Number(price), // Giá đồng hồ (chuyển sang số)
      image: imageUrl, // URL hình ảnh từ CloudFront
    };
    await addClock(Clock); // Gọi hàm thêm đồng hồ vào DynamoDB
    res.status(201).json({ message: 'Clock added successfully', Clock }); // Trả về mã 201 (tạo thành công) và thông tin đồng hồ
  } catch (error) { // Xử lý lỗi nếu có
    res.status(500).json({ error: error.message }); // Trả về lỗi 500 với thông báo chi tiết
  }
};

// Xóa dòng đồng hồ (API)
const deleteClockController = async (req, res) => { // Hàm xử lý yêu cầu DELETE để xóa đồng hồ
  try { // Bắt đầu khối try để xử lý lỗi
    const { clockId } = req.params; // Lấy clockId từ tham số URL (ví dụ: /Clocks/123)
    await deleteClock(clockId); // Gọi hàm xóa đồng hồ từ DynamoDB dựa trên clockId
    res.status(200).json({ message: 'Clock deleted successfully' }); // Trả về mã 200 (thành công) và thông báo
  } catch (error) { // Xử lý lỗi nếu có
    res.status(500).json({ error: error.message }); // Trả về lỗi 500 với thông báo chi tiết
  }
};

module.exports = { getClocksView, addClockController, deleteClockController }; // Xuất các hàm để dùng trong router hoặc file khác