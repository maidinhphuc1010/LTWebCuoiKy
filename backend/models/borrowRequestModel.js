import mongoose from 'mongoose'

const borrowRequestSchema = mongoose.Schema(
  {
    student: {
      id: { type: String, required: true },
      fullName: { type: String, required: true },
      code: { type: String, required: true },
    },
    deviceName: {
      type: String,
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true,
    },
    rejectionReason:{
      type: String,
      default: '',
    },
    returnDate: {
      type: Date,
      required: true,
    },
    actualReturnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'borrowing', 'returned', 'approved', 'rejected', 'overdue'], // Thêm 'overdue'
      default: 'pending',
    },
    description: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema)
export default BorrowRequest
