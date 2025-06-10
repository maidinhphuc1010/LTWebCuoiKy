import express from 'express';
import { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Route lấy danh sách tất cả Admin
router.get('/', getAdmins);

// Route lấy thông tin admin theo adminId
router.get('/:adminId', getAdminById);

// Route tạo mới Admin (POST)
router.post('/create', createAdmin);

// Route sửa thông tin Admin (PUT)
router.put('/update', updateAdmin);

// Route xóa Admin (DELETE)
router.delete('/:adminId', deleteAdmin);

export default router;
