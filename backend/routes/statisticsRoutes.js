import express from 'express'
import { getSystemStatistics } from '../controllers/statisticsController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// 🔒 Chỉ admin được truy cập
router.get('/summary', protect, admin, getSystemStatistics)

export default router
