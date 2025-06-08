import express from 'express'
import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
} from '../controllers/deviceController.js'

const router = express.Router()

router.route('/')
  .get(getDevices)
  .post(createDevice)

router.route('/:id')
  .put(updateDevice)
  .delete(deleteDevice)

export default router
