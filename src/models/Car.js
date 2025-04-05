const { dynamodb, docClient } = require('../config/aws'); // Nhập dynamodb và docClient từ file config AWS

// Hàm kiểm tra và tạo bảng Cars
const setupCarsTable = async () => {
  const tableName = 'Cars'; // Đặt tên bảng là 'Cars'
  const expectedSchema = { // Cấu trúc mong muốn của bảng
    KeySchema: [ // Định nghĩa khóa chính
      { AttributeName: 'carId', KeyType: 'HASH' }, // 'carId' là khóa chính kiểu HASH (duy nhất)
    ],
    AttributeDefinitions: [ // Định nghĩa thuộc tính
      { AttributeName: 'carId', AttributeType: 'S' }, // 'carId' là kiểu chuỗi (String)
    ],
  };

  try {
    // Kiểm tra xem bảng đã tồn tại chưa
    const table = await dynamodb.describeTable({ TableName: tableName }).promise(); // Lấy thông tin bảng Cars

    // So sánh cấu trúc hiện tại với cấu trúc mong muốn
    const hasCorrectSchema =
      JSON.stringify(table.Table.KeySchema) === JSON.stringify(expectedSchema.KeySchema) && // So sánh khóa
      JSON.stringify(table.Table.AttributeDefinitions) === JSON.stringify(expectedSchema.AttributeDefinitions); // So sánh thuộc tính

    if (!hasCorrectSchema) { // Nếu cấu trúc không khớp
      await dynamodb.deleteTable({ TableName: tableName }).promise(); // Xóa bảng cũ
      console.log('Existing table deleted due to schema mismatch'); // Thông báo xóa bảng
      await createCarsTable(); // Tạo lại bảng mới
    } else { // Nếu cấu trúc đúng
      console.log('Table already exists with correct schema:', table); // Thông báo bảng đã tồn tại và đúng
    }
  } catch (error) { // Xử lý lỗi
    if (error.code === 'ResourceNotFoundException') { // Nếu bảng chưa tồn tại
      await createCarsTable(); // Tạo bảng mới
    } else { // Nếu lỗi khác
      throw error; // Ném lỗi ra ngoài để xử lý tiếp
    }
  }
};

// Hàm tạo bảng Cars và chờ đến khi bảng sẵn sàng
const createCarsTable = async () => {
  const params = { // Cấu hình để tạo bảng
    TableName: 'Cars', // Tên bảng
    KeySchema: [ // Định nghĩa khóa chính
      { AttributeName: 'carId', KeyType: 'HASH' }, // 'carId' là khóa chính kiểu HASH
    ],
    AttributeDefinitions: [ // Định nghĩa thuộc tính
      { AttributeName: 'carId', AttributeType: 'S' }, // 'carId' là kiểu chuỗi (String)
    ],
    ProvisionedThroughput: { // Quy định dung lượng
      ReadCapacityUnits: 5, // 5 đơn vị đọc mỗi giây
      WriteCapacityUnits: 5, // 5 đơn vị ghi mỗi giây
    },
  };

  await dynamodb.createTable(params).promise(); // Gọi lệnh tạo bảng
  console.log('Creating Cars table...'); // Thông báo đang tạo bảng

  // Chờ đến khi bảng sẵn sàng để sử dụng
  await dynamodb
    .waitFor('tableExists', { TableName: 'Cars' }) // Đợi bảng chuyển sang trạng thái active
    .promise();
  console.log('Cars table created successfully and is now active'); // Thông báo bảng đã tạo xong
};

// Hàm thêm dòng xe
const addCar = async (car) => { // 'car' là object chứa thông tin xe (ví dụ: { carId: '1', name: 'Toyota' })
  const params = { // Cấu hình để thêm xe
    TableName: 'Cars', // Tên bảng
    Item: car, // Dữ liệu xe cần thêm
  };
  return docClient.put(params).promise(); // Thêm xe vào bảng và trả về Promise
};

// Hàm lấy tất cả dòng xe
const getAllCars = async () => {
  const params = { // Cấu hình để lấy dữ liệu
    TableName: 'Cars', // Tên bảng
  };
  return docClient.scan(params).promise(); // Quét toàn bộ bảng và trả về danh sách xe
};

// Hàm xóa dòng xe theo carId
const deleteCar = async (carId) => { // 'carId' là ID của xe cần xóa
  const params = { // Cấu hình để xóa xe
    TableName: 'Cars', // Tên bảng
    Key: { carId }, // Khóa chính để xác định xe cần xóa
  };
  return docClient.delete(params).promise(); // Xóa xe và trả về Promise
};

module.exports = { setupCarsTable, addCar, getAllCars, deleteCar }; // Xuất các hàm để dùng ở file khác