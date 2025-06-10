import asyncHandler from 'express-async-handler'
import BorrowRequest from '../models/borrowRequestModel.js'
import Device from '../models/deviceModel.js'
import sendMail from '../utils/sendMail.js'

// Lấy tất cả yêu cầu và tự động cập nhật trạng thái quá hạn
export const getBorrowRequests = asyncHandler(async (req, res) => {
  const requests = await BorrowRequest.find({})
  const now = new Date()

  const updatedRequests = await Promise.all(
    requests.map(async (r) => {
      if (
        r.status === 'borrowing' &&
        r.returnDate < now &&
        !r.actualReturnDate
      ) {
        r.status = 'overdue'
        await r.save()

        await sendMail(
          r.student.email,
          'Thông báo: Thiết bị quá hạn trả',
          `
            <p>Xin chào <strong>${r.student.fullName}</strong>,</p>
            <p>Thiết bị <strong>${r.deviceName}</strong> bạn mượn đã quá hạn trả từ ngày <b>${new Date(r.returnDate).toLocaleDateString()}</b>.</p>
            <p>Vui lòng hoàn trả thiết bị sớm nhất có thể.</p>
          `
        )
      }
      return r
    })
  )

  res.json(updatedRequests)
})

// Lịch sử mượn: chỉ lấy các bản ghi đã trả hoặc quá hạn
export const getBorrowHistory = asyncHandler(async (req, res) => {
  const history = await BorrowRequest.find({
    user: userId,
    status: { $in: ['returned', 'overdue'] },
  }).sort({ updatedAt: -1 })

  res.json(history)
})

// Mượn nhanh
export const quickBorrow = asyncHandler(async (req, res) => {
  const { deviceName } = req.params
  const { returnDate, description } = req.body

  const device = await Device.findOne({ name: deviceName })
  if (!device) {
    res.status(404)
    throw new Error('Không tìm thấy thiết bị')
  }

  const student = req.user
  if (!student || student.role !== 'student') {
    res.status(403)
    throw new Error('Chỉ sinh viên mới có thể mượn thiết bị')
  }

  if (!returnDate) {
    res.status(400)
    throw new Error('Phải chọn ngày trả')
  }

  const now = new Date()
  const returnD = new Date(returnDate)

  if (returnD <= now) {
    res.status(400)
    throw new Error('Ngày trả phải sau thời điểm hiện tại')
  }

  const borrow = new BorrowRequest({
    student: {
      id: student.studentId,
      fullName: student.fullName,
      code: student.code || student.studentId,
      email: student.email,
    },
    deviceName,
    borrowDate: now,
    returnDate: returnD,
    description: description || '',
    status: 'pending',
    user: student._id,
  })

  const created = await borrow.save()
  res.status(201).json(created)
})

// Cập nhật trạng thái yêu cầu mượn
export const updateBorrowStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body
  const validStatuses = ['pending', 'approved', 'borrowing', 'overdue', 'returned', 'rejected']

  if (!validStatuses.includes(status)) {
    res.status(400)
    throw new Error('Trạng thái không hợp lệ')
  }

  const record = await BorrowRequest.findById(req.params.id)
  if (!record) {
    res.status(404)
    throw new Error('Không tìm thấy yêu cầu mượn')
  }

  // Khi duyệt: chuyển từ pending → approved
  if (status === 'approved' && record.status === 'pending') {
    const device = await Device.findOne({ name: record.deviceName })
    if (!device) {
      res.status(404)
      throw new Error('Không tìm thấy thiết bị')
    }

    if (device.quantity <= 0) {
      res.status(400)
      throw new Error('Thiết bị đã hết số lượng')
    }

    device.quantity -= 1
    await device.save()

    await sendMail(
      record.student.email,
      'Yêu cầu mượn đã được duyệt',
      `
        <p>Xin chào <strong>${record.student.fullName}</strong>,</p>
        <p>Yêu cầu mượn thiết bị <strong>${record.deviceName}</strong> đã được <b>duyệt</b>.</p>
        <p>Ngày trả: ${new Date(record.returnDate).toLocaleDateString()}</p>
        <p><i>Lý do mượn:</i> ${record.description || '(không có)'}</p>
      `
    )
  }

  // Khi chuyển sang đã trả: từ borrowing/overdue → returned
  if (
    status === 'returned' &&
    ['borrowing', 'overdue', 'approved'].includes(record.status)
  ) {
    const device = await Device.findOne({ name: record.deviceName })
    if (device) {
      device.quantity += 1
      await device.save()
    }

    if (!record.actualReturnDate) {
      record.actualReturnDate = new Date()
    }
  }

  // Khi từ chối: chỉ từ pending
  if (status === 'rejected' && record.status === 'pending') {
    record.rejectionReason = rejectionReason || 'Không rõ lý do'

    await sendMail(
      record.student.email,
      'Yêu cầu mượn bị từ chối',
      `
        <p>Xin chào <strong>${record.student.fullName}</strong>,</p>
        <p>Yêu cầu mượn thiết bị <strong>${record.deviceName}</strong> của bạn đã bị <b>từ chối</b>.</p>
        <p><strong>Lý do:</strong> ${record.rejectionReason}</p>
      `
    )
  }

  record.status = status
  const updated = await record.save()
  res.json(updated)
})

// Cập nhật thông tin yêu cầu mượn (cho phép chỉnh sửa)
export const updateBorrowRequest = asyncHandler(async (req, res) => {
  const record = await BorrowRequest.findById(req.params.id)
  if (!record) {
    res.status(404)
    throw new Error('Không tìm thấy yêu cầu mượn')
  }

  Object.assign(record, req.body)
  const updated = await record.save()
  res.json(updated)
})
