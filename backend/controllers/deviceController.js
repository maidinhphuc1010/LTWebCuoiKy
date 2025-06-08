import asyncHandler from 'express-async-handler'
import Device from '../models/deviceModel.js'

// @desc Lấy tất cả thiết bị
export const getDevices = asyncHandler(async (req, res) => {
  const devices = await Device.find({})
  res.json(devices)
})

// @desc Thêm thiết bị
export const createDevice = asyncHandler(async (req, res) => {
  const device = new Device(req.body)
  const created = await device.save()
  res.status(201).json(created)
})

// @desc Cập nhật thiết bị
export const updateDevice = asyncHandler(async (req, res) => {
  const device = await Device.findById(req.params.id)
  if (!device) throw new Error('Không tìm thấy thiết bị')
  Object.assign(device, req.body)
  const updated = await device.save()
  res.json(updated)
})

// @desc Xóa thiết bị
export const deleteDevice = asyncHandler(async (req, res) => {
  const device = await Device.findById(req.params.id)
  if (!device) throw new Error('Không tìm thấy thiết bị')
  await device.remove()
  res.json({ message: 'Thiết bị đã bị xóa' })
})
