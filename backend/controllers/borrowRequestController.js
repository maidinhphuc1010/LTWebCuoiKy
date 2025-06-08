import asyncHandler from 'express-async-handler'
import BorrowRequest from '../models/borrowRequestModel.js'

// @desc Lấy tất cả yêu cầu mượn
export const getBorrowRequests = asyncHandler(async (req, res) => {
  const requests = await BorrowRequest.find({})
  res.json(requests)
})

// @desc Thêm yêu cầu mượn
export const createBorrowRequest = asyncHandler(async (req, res) => {
  const borrow = new BorrowRequest(req.body)
  const created = await borrow.save()
  res.status(201).json(created)
})

// @desc Cập nhật yêu cầu mượn
export const updateBorrowRequest = asyncHandler(async (req, res) => {
  const record = await BorrowRequest.findById(req.params.id)
  if (!record) throw new Error('Không tìm thấy yêu cầu mượn')
  Object.assign(record, req.body)
  const updated = await record.save()
  res.json(updated)
})

// @desc Xóa yêu cầu mượn
export const deleteBorrowRequest = asyncHandler(async (req, res) => {
  const record = await BorrowRequest.findById(req.params.id)
  if (!record) throw new Error('Không tìm thấy yêu cầu mượn')
  await record.remove()
  res.json({ message: 'Yêu cầu mượn đã bị xóa' })
})
