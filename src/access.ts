import type { IInitialState } from './services/base/typing';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: IInitialState) {
  // Đọc currentUser từ localStorage
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu người dùng từ localStorage:", error);
  }

  // Kiểm tra quyền truy cập của user
  const role = currentUser?.role;

  return {
    // Quyền truy cập cho admin
    admin: role === 'admin',
    // Quyền truy cập cho user (student)
    user: role === 'student',
  };
}
