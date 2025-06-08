import express from 'express'
import {
  getBorrowRequests,
  createBorrowRequest,
  updateBorrowRequest,
  deleteBorrowRequest,
} from '../controllers/borrowRequestController.js'

const router = express.Router()

router.route('/')
  .get(getBorrowRequests)
  .post(createBorrowRequest)

router.route('/:id')
  .put(updateBorrowRequest)
  .delete(deleteBorrowRequest)

export default router
