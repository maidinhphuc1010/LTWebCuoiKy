import express from 'express'
import {
  getBorrowRequests,
  getBorrowHistory,
  quickBorrow,
  updateBorrowRequest,
  updateBorrowStatus,
} from '../controllers/borrowRequestController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// 📋 Lấy danh sách tất cả yêu cầu mượn (admin hoặc nhân viên)
// Tự động cập nhật trạng thái quá hạn nếu cần
router.get('/', protect, getBorrowRequests)

// 🕓 Lịch sử mượn thiết bị (đã trả hoặc quá hạn)
router.get('/history', protect, getBorrowHistory)

// ⚡ Mượn nhanh thiết bị (sinh viên dùng)
router.post('/quick/:deviceName', protect, quickBorrow)

// 🛠️ Cập nhật nội dung yêu cầu mượn (mô tả, thời gian,...)
router.put('/:id', protect, updateBorrowRequest)

// 🔄 Cập nhật trạng thái yêu cầu (duyệt, từ chối, đã trả,...)
router.put('/:id/status', protect, updateBorrowStatus)

export default router
