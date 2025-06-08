import mongoose from 'mongoose';

const studentSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    className: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    cccd: { type: String, required: true, unique: true }, // Số CCCD
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;
