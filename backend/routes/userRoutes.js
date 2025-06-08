import express from 'express'
const router = express.Router()
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

// Đăng ký tài khoản mới & admin lấy danh sách user
router.route('/').post(registerUser).get(protect, admin, getUsers)

// Đăng nhập
router.post('/login', authUser)

// Lấy & cập nhật thông tin cá nhân
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

// Đổi mật khẩu (user đã đăng nhập)
router.put('/change-password', protect, changePassword)

// Quên mật khẩu (gửi email reset)
router.post('/forgot-password', forgotPassword)

// Đặt lại mật khẩu (sau khi nhận token qua email)
router.post('/reset-password/:token', resetPassword)

// Admin: xóa, lấy chi tiết, cập nhật user theo id
router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)

export default router
