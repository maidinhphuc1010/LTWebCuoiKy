import asyncHandler from 'express-async-handler'
import Device from '../models/deviceModel.js'
import Student from '../models/studentModel.js'
import BorrowRequest from '../models/borrowRequestModel.js'

// @desc Thống kê hệ thống
// @route GET /api/statistics/summary
// @access Private/Admin
export const getSystemStatistics = asyncHandler(async (req, res) => {
  const [totalDevices, totalStudents, totalBorrowRequests] = await Promise.all([
    Device.countDocuments(),
    Student.countDocuments(),
    BorrowRequest.countDocuments()
  ])

  // Tổng số lượt đăng nhập sinh viên (từ trường loginCount của mỗi student)
  const loginAgg = await Student.aggregate([
    {
      $group: {
        _id: null,
        totalLogins: { $sum: '$loginCount' }
      }
    }
  ])

  const totalLogins = loginAgg[0]?.totalLogins || 0

  res.json({
    totalDevices,
    totalStudents,
    totalBorrowRequests,
    totalStudentLogins: totalLogins
  })
})
