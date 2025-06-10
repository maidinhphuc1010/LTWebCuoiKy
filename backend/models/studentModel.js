import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    className: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    cccd: { type: String, required: true, unique: true }, // Mật khẩu đăng nhập
    role: { type: String, enum: ['admin', 'student'], default: 'student' },
    loginCount: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // Thiết bị đã mượn
    borrowedDevices: [
      {
        device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
        quantity: { type: Number, default: 1 },
        borrowedAt: { type: Date, default: Date.now },
        returnAt: { type: Date },
      }
    ],
  },
  { timestamps: true }
);

// ✅ Tự động hash mật khẩu nếu thay đổi
studentSchema.pre('save', async function (next) {
  if (!this.isModified('cccd')) return next();
  const salt = await bcrypt.genSalt(10);
  this.cccd = await bcrypt.hash(this.cccd, salt);
  next();
});

// ✅ So sánh mật khẩu
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.cccd);
};

// ✅ Xuất mô hình dùng được cho ES Module (dùng `export`)
const Student = mongoose.model('Student', studentSchema);
export default Student;
