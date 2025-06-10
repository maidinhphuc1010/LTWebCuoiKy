import express from 'express';
import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
} from '../controllers/deviceController.js';

const router = express.Router();

// Route to get all devices (PUBLIC)
router.route('/')
  .get(getDevices)
  .post(createDevice); // ❌ Không cần protect nữa

// Route for specific device by ID (now also PUBLIC)
router.route('/:id')
  .put(updateDevice)    // ❌ Không cần protect
  .delete(deleteDevice); // ❌ Không cần protect

export default router;
