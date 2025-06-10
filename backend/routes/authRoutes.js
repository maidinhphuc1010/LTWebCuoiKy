import express from 'express';
import { loginUser, changePassword, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route đăng nhập không yêu cầu token
router.post('/login', loginUser);

// Các route yêu cầu quyền truy cập và xác thực qua token
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
