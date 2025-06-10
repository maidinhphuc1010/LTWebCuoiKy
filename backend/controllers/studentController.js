import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import Student from '../models/studentModel.js';

// Lấy danh sách sinh viên
const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({});
  res.json(students);
});

// Thêm sinh viên mới
const addStudent = asyncHandler(async (req, res) => {
  const { studentId, password } = req.body;

  // Kiểm tra xem có thiếu thông tin cần thiết không
  if (!studentId || !password) {
    res.status(400);
    throw new Error('Thiếu mã sinh viên hoặc mật khẩu');
  }

  const existing = await Student.findOne({ studentId });

  if (existing) {
    res.status(400);
    throw new Error('Sinh viên đã tồn tại');
  }

  // Mã hóa mật khẩu trước khi lưu
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(password, salt);

  const created = await Student.create(req.body);
  res.status(201).json(created);
});

// Cập nhật sinh viên
const updateStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const student = await Student.findOne({ studentId });

  if (!student) {
    res.status(404);
    throw new Error('Không tìm thấy sinh viên để cập nhật');
  }

  Object.assign(student, req.body);
  const updated = await student.save();
  res.json(updated);
});

// Xóa sinh viên
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ studentId: req.params.studentId });
  if (!student) {
    res.status(404);
    throw new Error('Không tìm thấy sinh viên');
  }

  await student.deleteOne();
  res.json({ message: 'Đã xóa sinh viên' });
});

// Thêm hoặc cập nhật sinh viên (gộp)
const addOrUpdateStudent = asyncHandler(async (req, res) => {
  const { studentId, password, email } = req.body;

  // Kiểm tra nếu thiếu mã sinh viên hoặc mật khẩu
  if (!studentId || !password) {
    res.status(400);
    throw new Error('Thiếu mã sinh viên hoặc mật khẩu');
  }

  const existing = await Student.findOne({ studentId });

  let student;
  if (existing) {
    // Cập nhật thông tin sinh viên đã có
    Object.assign(existing, req.body);
    student = await existing.save();
  } else {
    // Thêm sinh viên mới
    req.body.role = req.body.role || 'student';  // Mặc định gán 'student' nếu không có role

    // Mã hóa mật khẩu nếu có
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt); // Lưu mật khẩu đã mã hóa
    student = await Student.create(req.body);
  }

  // Tạo token JWT cho sinh viên sau khi thêm hoặc cập nhật
  const token = jwt.sign({ id: student._id, role: student.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // Trả về thông tin sinh viên và token JWT
  res.status(201).json({
    message: existing ? 'Đã cập nhật thông tin sinh viên' : 'Đã thêm sinh viên mới',
    student,
    token,  // Trả về token JWT
  });
});

export {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  addOrUpdateStudent,
};
