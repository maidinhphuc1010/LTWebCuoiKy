import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    adminId: { type: String, required: true, unique: true },
    idCardNumber: { type: String, required: true, unique: true }, // CCCD = password
    address: { type: String },
    employeeId: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'admin' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('idCardNumber')) return next();
  const salt = await bcrypt.genSalt(10);
  this.idCardNumber = await bcrypt.hash(this.idCardNumber, salt);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.idCardNumber);
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
