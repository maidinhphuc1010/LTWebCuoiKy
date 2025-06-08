import asyncHandler from 'express-async-handler';
import Student from '../models/studentModel.js';

// @desc    Lấy danh sách sinh viên
// @route   GET /api/students
// @access  Private/Admin
const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({});
  res.json(students);
});

// @desc    Thêm hoặc cập nhật sinh viên
// @route   POST /api/students
// @access  Private/Admin
const addOrUpdateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ studentId: req.body.studentId });

  if (student) {
    // cập nhật nếu đã tồn tại
    Object.assign(student, req.body);
    const updated = await student.save();
    res.json(updated);
  } else {
    // thêm mới
    const created = await Student.create(req.body);
    res.status(201).json(created);
  }
});

// @desc    Xóa sinh viên
// @route   DELETE /api/students/:studentId
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ studentId: req.params.studentId });
  if (!student) {
    res.status(404);
    throw new Error('Không tìm thấy sinh viên');
  }

  await student.deleteOne();
  res.json({ message: 'Đã xóa sinh viên' });
});

export { getStudents, addOrUpdateStudent, deleteStudent };
