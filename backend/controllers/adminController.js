import asyncHandler from 'express-async-handler'
import Admin from '../models/adminModel.js'

// Lấy danh sách admin
const getAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({})
  res.json(admins)
})

// Thêm hoặc cập nhật admin
const addOrUpdateAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ adminId: req.body.adminId })

  if (admin) {
    Object.assign(admin, req.body)
    const updated = await admin.save()
    res.json(updated)
  } else {
    const created = await Admin.create(req.body)
    res.status(201).json(created)
  }
})

// Xóa admin
const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ adminId: req.params.adminId })
  if (!admin) {
    res.status(404)
    throw new Error('Không tìm thấy admin')
  }

  await admin.deleteOne()
  res.json({ message: 'Đã xóa admin' })
})

export { getAdmins, addOrUpdateAdmin, deleteAdmin }
