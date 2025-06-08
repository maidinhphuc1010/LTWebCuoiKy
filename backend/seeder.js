import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

// Dữ liệu mẫu
import users from './data/users.js'
import devices from './data/devices.js'
import students from './data/students.js'
import borrowRequests from './data/borrowRequests.js'
import adminsRaw from './data/admins.js' // 📌 thêm dòng này

// Models
import User from './models/userModel.js'
import Device from './models/deviceModel.js'
import Student from './models/studentModel.js'
import BorrowRequest from './models/borrowRequestModel.js'
import Admin from './models/adminModel.js' // 📌 thêm dòng này

// Kết nối DB
import connectDB from './config/db.js'

dotenv.config()
connectDB()

// ✅ Sinh employeeId = 'ADMIN' + 5 số cuối của idCardNumber
const admins = adminsRaw.map((admin) => ({
  ...admin,
  employeeId: 'ADMIN' + admin.idCardNumber.slice(-5),
}))

const importData = async () => {
  try {
    // Xóa dữ liệu cũ
    await BorrowRequest.deleteMany()
    await Student.deleteMany()
    await Admin.deleteMany()
    await Device.deleteMany()
    await User.deleteMany()

    // Thêm users
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    // Thêm devices có gắn user là admin
    const sampleDevices = devices.map((device) => ({
      ...device,
      user: adminUser,
    }))
    await Device.insertMany(sampleDevices)

    // Thêm admins
    await Admin.insertMany(admins)

    // Thêm students
    await Student.insertMany(students)

    // ✅ Gắn user và xử lý status cho borrow requests
    const sampleBorrowRequests = borrowRequests.map((request) => ({
      ...request,
      user: adminUser,
      status: request.status === 'waiting' ? 'pending' : request.status,
    }))
    await BorrowRequest.insertMany(sampleBorrowRequests)

    console.log('✅ Data imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`❌ ${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await BorrowRequest.deleteMany()
    await Student.deleteMany()
    await Admin.deleteMany()
    await Device.deleteMany()
    await User.deleteMany()

    console.log('🗑️ Data destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`❌ ${error}`.red.inverse)
    process.exit(1)
  }
}

// Chạy bằng: node backend/seeder.js [-d]
if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
