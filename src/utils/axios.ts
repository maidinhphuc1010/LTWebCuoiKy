import { message, notification } from 'antd';
import axios from 'axios';
import data from './data';

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000' // Sửa tại đây nếu bạn có API server khác
      : '', // Production dùng relative path
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Gắn token nếu cần
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    let er = error?.response?.data;
    if ((error?.response?.config?.responseType as string)?.toLowerCase() === 'arraybuffer') {
      const decoder = new TextDecoder('utf-8');
      er = JSON.parse(decoder.decode(er));
    }

    const descriptionError =
      Array.isArray(er?.detail?.exception?.response?.message)
        ? er?.detail?.exception?.response?.message?.join(', ')
        : Array.isArray(er?.detail?.exception?.errors)
        ? er?.detail?.exception?.errors?.map((e: any) => e?.message)?.join(', ')
        : data.error[er?.detail?.errorCode || er?.errorCode] ||
          er?.detail?.message ||
          er?.message ||
          er?.errorDescription;

    const originalRequest = error.config;
    let originData = originalRequest?.data;
    if (typeof originData === 'string') originData = JSON.parse(originData);

    if (!originData?.silent) {
      switch (error?.response?.status) {
        case 400:
          notification.error({ message: 'Dữ liệu chưa đúng (004)', description: descriptionError });
          break;
        case 401:
          if (originalRequest?.headers?.Authorization) {
            notification.error({
              message: 'Phiên đăng nhập đã thay đổi (104)',
              description: 'Vui lòng tải lại trang (F5) để cập nhật. Chú ý các dữ liệu chưa lưu sẽ bị mất!',
            });
          }
          break;
        case 403:
        case 405:
          notification.error({ message: 'Thao tác không được phép (304)', description: descriptionError });
          break;
        case 404:
          notification.error({ message: 'Không tìm thấy dữ liệu (040)', description: descriptionError });
          break;
        case 409:
          notification.error({ message: 'Dữ liệu chưa đúng (904)', description: descriptionError });
          break;
        case 500:
        case 502:
          notification.error({ message: 'Hệ thống đang cập nhật (005)', description: descriptionError });
          break;
        default:
          message.error('Hệ thống đang cập nhật. Vui lòng thử lại sau');
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
