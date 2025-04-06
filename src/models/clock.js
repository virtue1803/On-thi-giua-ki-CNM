const { dynamodb, docClient } = require('../config/aws'); // Nhập dynamodb và docClient từ file config AWS

// Hàm kiểm tra và tạo bảng Clocks
const setupClocksTable = async () => {
  const tableName = 'Clocks'; // Đặt tên bảng là 'Clocks'
  const expectedSchema = { // Cấu trúc mong muốn của bảng
    KeySchema: [ // Định nghĩa khóa chính
      { AttributeName: 'clockId', KeyType: 'HASH' }, // 'clockId' là khóa chính kiểu HASH (duy nhất)
    ],
    AttributeDefinitions: [ // Định nghĩa thuộc tính
      { AttributeName: 'clockId', AttributeType: 'S' }, // 'clockId' là kiểu chuỗi (String)
    ],
  };

  try {
    // Kiểm tra đồng hồm bảng đã tồn tại chưa
    const table = await dynamodb.describeTable({ TableName: tableName }).promise(); // Lấy thông tin bảng Clocks

    // So sánh cấu trúc hiện tại với cấu trúc mong muốn
    const hasCorrectSchema =
      JSON.stringify(table.Table.KeySchema) === JSON.stringify(expectedSchema.KeySchema) && // So sánh khóa
      JSON.stringify(table.Table.AttributeDefinitions) === JSON.stringify(expectedSchema.AttributeDefinitions); // So sánh thuộc tính

    if (!hasCorrectSchema) { // Nếu cấu trúc không khớp
      await dynamodb.deleteTable({ TableName: tableName }).promise(); // Xóa bảng cũ
      console.log('Existing table deleted due to schema mismatch'); // Thông báo xóa bảng
      await createClocksTable(); // Tạo lại bảng mới
    } else { // Nếu cấu trúc đúng
      console.log('Table already exists with correct schema:', table); // Thông báo bảng đã tồn tại và đúng
    }
  } catch (error) { // Xử lý lỗi
    if (error.code === 'ResourceNotFoundException') { // Nếu bảng chưa tồn tại
      await createClocksTable(); // Tạo bảng mới
    } else { // Nếu lỗi khác
      throw error; // Ném lỗi ra ngoài để xử lý tiếp
    }
  }
};

// Hàm tạo bảng Clocks và chờ đến khi bảng sẵn sàng
const createClocksTable = async () => {
  const params = { // Cấu hình để tạo bảng
    TableName: 'Clocks', // Tên bảng
    KeySchema: [ // Định nghĩa khóa chính
      { AttributeName: 'clockId', KeyType: 'HASH' }, // 'clockId' là khóa chính kiểu HASH
    ],
    AttributeDefinitions: [ // Định nghĩa thuộc tính
      { AttributeName: 'clockId', AttributeType: 'S' }, // 'clockId' là kiểu chuỗi (String)
    ],
    ProvisionedThroughput: { // Quy định dung lượng
      ReadCapacityUnits: 5, // 5 đơn vị đọc mỗi giây
      WriteCapacityUnits: 5, // 5 đơn vị ghi mỗi giây
    },
  };

  await dynamodb.createTable(params).promise(); // Gọi lệnh tạo bảng
  console.log('Creating Clocks table...'); // Thông báo đang tạo bảng

  // Chờ đến khi bảng sẵn sàng để sử dụng
  await dynamodb
    .waitFor('tableExists', { TableName: 'Clocks' }) // Đợi bảng chuyển sang trạng thái active
    .promise();
  console.log('Clocks table created successfully and is now active'); // Thông báo bảng đã tạo xong
};

// Hàm thêm dòng đồng hồ
const addClock = async (Clock) => { // 'Clock' là object chứa thông tin đồng hồ (ví dụ: { clockId: '1', name: 'Toyota' })
  const params = { // Cấu hình để thêm đồng hồ
    TableName: 'Clocks', // Tên bảng
    Item: Clock, // Dữ liệu đồng hồ cần thêm
  };
  return docClient.put(params).promise(); // Thêm đồng hồ vào bảng và trả về Promise
};

// Hàm lấy tất cả dòng đồng hồ
const getAllClocks = async () => {
  const params = { // Cấu hình để lấy dữ liệu
    TableName: 'Clocks', // Tên bảng
  };
  return docClient.scan(params).promise(); // Quét toàn bộ bảng và trả về danh sách đồng hồ
};

// Hàm xóa dòng đồng hồ theo clockId
const deleteClock = async (clockId) => { // 'clockId' là ID của đồng hồ cần xóa
  const params = { // Cấu hình để xóa đồng hồ
    TableName: 'Clocks', // Tên bảng
    Key: { clockId }, // Khóa chính để xác định đồng hồ cần xóa
  };
  return docClient.delete(params).promise(); // Xóa đồng hồ và trả về Promise
};

module.exports = { setupClocksTable, addClock, getAllClocks, deleteClock }; // Xuất các hàm để dùng ở file khác