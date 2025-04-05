const { dynamodb, docClient } = require('../config/aws');

// Hàm kiểm tra và tạo bảng Cars
const setupCarsTable = async () => {
  const tableName = 'Cars';
  const expectedSchema = {
    KeySchema: [
      { AttributeName: 'carId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'carId', AttributeType: 'S' },
    ],
  };

  try {
    // Kiểm tra bảng đã tồn tại chưa
    const table = await dynamodb.describeTable({ TableName: tableName }).promise();

    // So sánh cấu trúc bảng hiện tại với cấu trúc mong muốn
    const hasCorrectSchema =
      JSON.stringify(table.Table.KeySchema) === JSON.stringify(expectedSchema.KeySchema) &&
      JSON.stringify(table.Table.AttributeDefinitions) === JSON.stringify(expectedSchema.AttributeDefinitions);

    if (!hasCorrectSchema) {
      // Nếu cấu trúc không khớp, xóa bảng
      await dynamodb.deleteTable({ TableName: tableName }).promise();
      console.log('Existing table deleted due to schema mismatch');
      await createCarsTable(); // Tạo lại bảng
    } else {
      console.log('Table already exists with correct schema:', table);
    }
  } catch (error) {
    if (error.code === 'ResourceNotFoundException') {
      // Nếu bảng chưa tồn tại, tạo bảng mới
      await createCarsTable();
    } else {
      throw error;
    }
  }
};

// Hàm tạo bảng Cars và chờ đến khi bảng sẵn sàng
const createCarsTable = async () => {
  const params = {
    TableName: 'Cars',
    KeySchema: [
      { AttributeName: 'carId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'carId', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  await dynamodb.createTable(params).promise();
  console.log('Creating Cars table...');

  // Chờ bảng sẵn sàng
  await dynamodb
    .waitFor('tableExists', { TableName: 'Cars' })
    .promise();
  console.log('Cars table created successfully and is now active');
};

// Hàm thêm dòng xe
const addCar = async (car) => {
  const params = {
    TableName: 'Cars',
    Item: car,
  };
  return docClient.put(params).promise();
};

// Hàm lấy tất cả dòng xe
const getAllCars = async () => {
  const params = {
    TableName: 'Cars',
  };
  return docClient.scan(params).promise();
};

// Hàm xóa dòng xe theo carId
const deleteCar = async (carId) => {
  const params = {
    TableName: 'Cars',
    Key: { carId },
  };
  return docClient.delete(params).promise();
};

module.exports = { setupCarsTable, addCar, getAllCars, deleteCar };