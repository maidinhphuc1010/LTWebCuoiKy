import express from 'express';
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  addOrUpdateStudent,
} from '../controllers/studentController.js';

const router = express.Router();

// Route lấy danh sách Sinh viên
router.get('/', getStudents);

// Route thêm Sinh viên mới
router.post('/add', addStudent);

// Route cập nhật Sinh viên
router.put('/:studentId', updateStudent);

// Route xóa Sinh viên
router.delete('/:studentId', deleteStudent);

// Route thêm hoặc cập nhật Sinh viên
router.post('/add-or-update', addOrUpdateStudent);

export default router;
