// src/axios.ts
import { message, notification } from 'antd';
import axios from 'axios';

// Tạo instance axios và cấu hình baseURL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // Base URL của API
  headers: {
    'Content-Type': 'application/json', // Header mặc định
  },
});

// Interceptor để thêm Authorization và xử lý phản hồi
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Thêm token vào header Authorization nếu có
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi phản hồi từ server
axiosInstance.interceptors.response.use(
  (response) => response,  // Trả về dữ liệu nếu thành công
  (error) => {
    const er = error?.response?.data;
    const descriptionError =
      Array.isArray(er?.detail?.exception?.response?.message)
        ? er?.detail?.exception?.response?.message?.join(', ')
        : er?.detail?.message || er?.message || er?.errorDescription;

    // Xử lý các lỗi phổ biến
    switch (error?.response?.status) {
      case 400:
        notification.error({
          message: 'Dữ liệu chưa đúng (004)',
          description: descriptionError,
        });
        break;

      case 401:
        notification.error({
          message: 'Phiên đăng nhập đã thay đổi (104)',
          description: 'Vui lòng tải lại trang (F5) để cập nhật.',
        });
        break;

      case 403:
        notification.error({
          message: 'Thao tác không được phép (304)',
          description: descriptionError,
        });
        break;

      case 404:
        notification.error({
          message: 'Không tìm thấy dữ liệu (040)',
          description: descriptionError,
        });
        break;

      case 500:
      case 502:
        notification.error({
          message: 'Hệ thống đang cập nhật (005)',
          description: descriptionError,
        });
        break;

      default:
        message.error('Hệ thống đang cập nhật. Vui lòng thử lại sau');
        break;
    }

    return Promise.reject(error); // Trả về lỗi nếu có
  }
);

export default axiosInstance;  // Xuất axiosInstance để sử dụng trong các phần khác của ứng dụng
