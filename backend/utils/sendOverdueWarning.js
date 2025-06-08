import nodemailer from 'nodemailer'
import BorrowRequest from '../models/borrowRequestModel.js'
import User from '../models/userModel.js'

// Tạo transporter một lần và tái sử dụng
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Thiếu thông tin cấu hình email (EMAIL_USER hoặc EMAIL_PASS)')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Thêm các tùy chọn để tăng độ tin cậy
    pool: true, // Sử dụng pool để tái sử dụng kết nối
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000, // Đợi 1 giây giữa các email
    rateLimit: 5, // Tối đa 5 email mỗi giây
  })
}

const sendOverdueWarning = async () => {
  // Tìm các yêu cầu quá hạn chưa trả và chưa gửi cảnh báo
  const overdueRequests = await BorrowRequest.find({
    returnDate: { $lt: new Date() },
    isReturned: false,
    notifySent: false,
  }).populate('user', 'email name')

  if (!overdueRequests || overdueRequests.length === 0) {
    return []
  }

  const results = []
  let transporter

  try {
    // Tạo transporter
    transporter = createTransporter()
    
    // Kiểm tra kết nối
    await transporter.verify()
  } catch (error) {
    console.error('Lỗi kết nối email:', error)
    throw {
      name: 'EmailError',
      message: 'Không thể kết nối đến máy chủ email: ' + error.message
    }
  }

  for (const req of overdueRequests) {
    try {
      if (!req.user || !req.user.email) {
        throw new Error('Không tìm thấy thông tin email của người dùng')
      }

      const mailOptions = {
        from: {
          name: 'Hệ thống quản lý thiết bị',
          address: process.env.EMAIL_USER
        },
        to: req.user.email,
        subject: 'Cảnh báo quá hạn trả thiết bị',
        text: `Xin chào ${req.user.name},\n\nBạn đã quá hạn trả thiết bị. Vui lòng trả thiết bị sớm nhất có thể!\n\nNgày phải trả: ${new Date(req.returnDate).toLocaleDateString('vi-VN')}\n\nTrân trọng,\nBan quản lý thiết bị`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d32f2f;">Cảnh báo quá hạn trả thiết bị</h2>
            <p>Xin chào <strong>${req.user.name}</strong>,</p>
            <p>Bạn đã quá hạn trả thiết bị. Vui lòng trả thiết bị sớm nhất có thể!</p>
            <p><strong>Ngày phải trả:</strong> ${new Date(req.returnDate).toLocaleDateString('vi-VN')}</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">Trân trọng,<br>Ban quản lý thiết bị</p>
          </div>
        `
      }

      // Gửi email
      await transporter.sendMail(mailOptions)

      // Đánh dấu đã gửi cảnh báo
      req.notifySent = true
      await req.save()

      results.push({
        requestId: req._id,
        userId: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        returnDate: req.returnDate,
        status: 'success'
      })
    } catch (error) {
      console.error(`Lỗi khi gửi email cho ${req.user?.email}:`, error)
      
      results.push({
        requestId: req._id,
        userId: req.user?._id,
        userName: req.user?.name,
        userEmail: req.user?.email,
        returnDate: req.returnDate,
        status: 'error',
        error: error.message
      })
    }
  }

  // Đóng kết nối transporter
  if (transporter) {
    transporter.close()
  }

  return results
}

export default sendOverdueWarning