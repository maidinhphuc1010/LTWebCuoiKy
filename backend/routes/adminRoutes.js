import express from 'express'
import {
  getAdmins,
  addOrUpdateAdmin,
  deleteAdmin,
} from '../controllers/adminController.js'

const router = express.Router()

router.route('/')
  .get(getAdmins)                 // Mở public nếu cần
  .post(addOrUpdateAdmin)

router.route('/:adminId')
  .delete(deleteAdmin)

export default router
