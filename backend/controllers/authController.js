import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import Student from '../models/studentModel.js';

// Đăng nhập người dùng
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  // Kiểm tra nếu người dùng nhập thiếu thông tin
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' });
  }

  try {
    // Kiểm tra Admin
    let user = await Admin.findOne({ email: identifier });
    if (!user) {
      // Kiểm tra Student nếu không phải Admin
      user = await Student.findOne({ email: identifier });
      if (!user) {
        return res.status(401).json({ message: 'Tài khoản không hợp lệ' });
      }
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.idCardNumber || user.cccd);
    if (!isMatch) {
      return res.status(401).json({ message: 'Sai mật khẩu' });
    }

    // Tạo token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { user } = req; // Người dùng từ middleware protect

  // Kiểm tra nếu mật khẩu mới đủ dài
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
  }

  // Kiểm tra mật khẩu hiện tại
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
  }

  // Mã hóa mật khẩu mới
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: 'Đổi mật khẩu thành công' });
};

// Quên mật khẩu
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Kiểm tra email
  let user = await Admin.findOne({ email }) || await Student.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
  }

  // Tạo token reset mật khẩu
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Gửi email khôi phục mật khẩu (Giả sử bạn đã có chức năng gửi email)
  // sendResetPasswordEmail(user.email, resetToken);

  res.json({ message: 'Đã gửi email khôi phục mật khẩu' });
};

// Reset mật khẩu
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Admin.findById(decoded.id) || await Student.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Mã hóa mật khẩu mới
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Mật khẩu đã được đặt lại thành công' });
  } catch (error) {
    res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
