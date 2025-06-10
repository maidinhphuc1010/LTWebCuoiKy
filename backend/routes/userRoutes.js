import express from 'express'
import { getUserProfile } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Lấy thông tin cá nhân của người dùng đang đăng nhập
router.get('/profile', protect, getUserProfile)

export default router
