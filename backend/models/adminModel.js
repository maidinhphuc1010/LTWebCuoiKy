import mongoose from 'mongoose'

const adminSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    adminId: { type: String, required: true, unique: true },
    idCardNumber: { type: String, required: true, unique: true },
    address: { type: String },
    employeeId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
)

const Admin = mongoose.model('Admin', adminSchema)
export default Admin
