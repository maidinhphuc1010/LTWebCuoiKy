import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import Student from '../models/studentModel.js';

// Middleware bảo vệ các route yêu cầu quyền truy cập
const protect = async (req, res, next) => {
  let token;

  // Kiểm tra token trong header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      // Lấy token từ header Authorization
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm người dùng (Admin hoặc Student) trong cơ sở dữ liệu
      const user = await findUserById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Tài khoản không hợp lệ hoặc đã bị xóa' });
      }

      // Lưu thông tin người dùng vào req.user
      req.user = user;

      // Tiếp tục với request nếu người dùng hợp lệ
      next();
    } catch (error) {
      console.error('Lỗi xác thực:', error);
      return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Không có token, không thể truy cập' });
  }
};

// Hàm tìm người dùng trong cơ sở dữ liệu
const findUserById = async (userId) => {
  return await Admin.findById(userId) || await Student.findById(userId);
};

// Middleware kiểm tra xem người dùng có phải là admin không
const admin = (req, res, next) => {
  // Kiểm tra xem người dùng có phải là admin không
  if (req.user && req.user.role === 'admin') {
    next();  // Nếu là admin, tiếp tục
  } else {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
  }
};

export { protect, admin };
