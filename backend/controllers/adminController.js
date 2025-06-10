import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';

// Lấy danh sách admin
const getAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({});
  res.json(admins);
});

// Lấy thông tin admin theo adminId
const getAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ adminId: req.params.adminId });

  if (!admin) {
    res.status(404);
    throw new Error('Không tìm thấy admin');
  }

  res.json(admin);
});

// Tạo mới admin
const createAdmin = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    adminId,
    idCardNumber,
    address,
  } = req.body;

  if (!adminId || !fullName || !email || !idCardNumber || !phoneNumber) {
    res.status(400);
    throw new Error('Thiếu thông tin quan trọng');
  }

  const adminExists = await Admin.findOne({
    $or: [{ adminId }, { email }],
  });

  if (adminExists) {
    res.status(400);
    throw new Error('AdminId hoặc Email đã tồn tại');
  }

  // Tự sinh employeeId: EMP0001, EMP0002,...
  const count = await Admin.countDocuments();
  const newEmployeeId = `EMP${String(count + 1).padStart(4, '0')}`;

  const admin = await Admin.create({
    fullName,
    email,
    phoneNumber,
    adminId,
    idCardNumber,
    address,
    employeeId: newEmployeeId,
  });

  res.status(201).json(admin);
});

// Cập nhật admin
const updateAdmin = asyncHandler(async (req, res) => {
  const { adminId, fullName, phoneNumber, address, role } = req.body;

  if (!adminId) {
    res.status(400);
    throw new Error('Thiếu adminId');
  }

  const admin = await Admin.findOne({ adminId });

  if (!admin) {
    res.status(404);
    throw new Error('Không tìm thấy admin');
  }

  if (fullName) admin.fullName = fullName;
  if (phoneNumber) admin.phoneNumber = phoneNumber;
  if (address) admin.address = address;
  if (role) admin.role = role;

  const updatedAdmin = await admin.save();
  res.json(updatedAdmin);
});

// Xoá admin
const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ adminId: req.params.adminId });

  if (!admin) {
    res.status(404);
    throw new Error('Không tìm thấy admin');
  }

  await admin.deleteOne();
  res.json({ message: 'Đã xóa admin' });
});

export { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin };
