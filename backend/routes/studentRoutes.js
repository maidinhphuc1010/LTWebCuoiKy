import express from 'express'
import {
  getStudents,
  addOrUpdateStudent,
  deleteStudent,
} from '../controllers/studentController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// ❗ Mở GET cho tất cả mọi người
router.route('/')
  .get(getStudents)                          // ❌ Không cần đăng nhập, ai cũng xem được
  .post(protect, admin, addOrUpdateStudent) // ✅ Chỉ admin mới có thể thêm hoặc cập nhật

router.route('/:studentId')
  .delete(protect, admin, deleteStudent)    // ✅ Chỉ admin mới có thể xóa

export default router
