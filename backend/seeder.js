import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import bcrypt from 'bcryptjs'

import devices from './data/devices.js'
import students from './data/students.js'
import borrowRequests from './data/borrowRequests.js'
import adminsRaw from './data/admins.js'

import Device from './models/deviceModel.js'
import Student from './models/studentModel.js'
import BorrowRequest from './models/borrowRequestModel.js'
import Admin from './models/adminModel.js'

import connectDB from './config/db.js'

dotenv.config()
connectDB()

// Chuẩn hóa employeeId cho admin
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

    // Tạo admin trước để có ID
    const hashedAdmins = admins.map((a) => ({
      ...a,
      idCardNumber: bcrypt.hashSync(a.idCardNumber, 10),
    }))
    const createdAdmins = await Admin.insertMany(hashedAdmins)
    const adminUser = createdAdmins[0]._id

    // Thêm thiết bị và gán user
    const sampleDevices = devices.map((device) => ({
      ...device,
      user: adminUser,
    }))
    await Device.insertMany(sampleDevices)

    // Thêm sinh viên
    const hashedStudents = students.map((s) => ({
      ...s,
      cccd: bcrypt.hashSync(s.cccd, 10),
    }))
    await Student.insertMany(hashedStudents)

    // Thêm yêu cầu mượn và gán user
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

    console.log('🗑️ Data destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`❌ ${error}`.red.inverse)
    process.exit(1)
  }
}

// Chạy import hoặc xóa
if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
