import asyncHandler from 'express-async-handler';
import Device from '../models/deviceModel.js';

// Convert MongoDB object to client format
const toClientDevice = (device) => {
  const obj = device.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

// @desc Lấy tất cả thiết bị
export const getDevices = asyncHandler(async (req, res) => {
  const devices = await Device.find({});
  res.json(devices.map(toClientDevice));
});

// @desc Thêm thiết bị (nếu trùng tên thì cộng số lượng)
export const createDevice = asyncHandler(async (req, res) => {
  const { name, quantity, ...rest } = req.body;

  if (!name || typeof quantity !== 'number') {
    res.status(400);
    throw new Error('Tên và số lượng thiết bị là bắt buộc');
  }

  const existing = await Device.findOne({ name: new RegExp(`^${name}$`, 'i') });

  if (existing) {
    existing.quantity += quantity;
    Object.assign(existing, rest);
    const updated = await existing.save();
    return res.json({
      message: 'Thiết bị đã tồn tại, đã cộng thêm số lượng và cập nhật thông tin',
      device: toClientDevice(updated),
    });
  }

  const device = new Device({ name, quantity, ...rest });
  const created = await device.save();

  res.status(201).json({
    message: 'Thiết bị mới đã được tạo',
    device: toClientDevice(created),
  });
});

// @desc Cập nhật thiết bị
export const updateDevice = asyncHandler(async (req, res) => {
  const device = await Device.findById(req.params.id);
  if (!device) {
    res.status(404);
    throw new Error('Không tìm thấy thiết bị');
  }

  Object.assign(device, req.body);
  const updated = await device.save();

  res.json({
    message: 'Cập nhật thiết bị thành công',
    device: toClientDevice(updated),
  });
});

// @desc Xóa thiết bị
export const deleteDevice = asyncHandler(async (req, res) => {
  const device = await Device.findById(req.params.id);
  if (!device) {
    res.status(404);
    throw new Error('Không tìm thấy thiết bị');
  }

  await device.remove();
  res.json({ message: 'Thiết bị đã bị xóa' });
});
