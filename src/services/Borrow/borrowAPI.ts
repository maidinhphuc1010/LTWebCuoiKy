import axios from 'axios';
import { BorrowRecord } from './typings'; // Điều chỉnh lại đường dẫn nếu cần

const BORROW_API_URL = 'http://localhost:5000/api/borrow';

// Tạo header Authorization từ token trong localStorage
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// 📋 Lấy danh sách tất cả yêu cầu mượn (admin hoặc nhân viên)
export const fetchBorrowRequests = async () => {
  const res = await axios.get(`${BORROW_API_URL}`, authHeader());
  return res.data;
};

// 🕓 Lịch sử mượn thiết bị (đã trả hoặc quá hạn)
export const fetchMyBorrowHistory = async (): Promise<BorrowRecord[]> => {
  const res = await axios.get(`${BORROW_API_URL}/history`, authHeader());
  return res.data;
};

// ⚡ Mượn nhanh thiết bị (sinh viên dùng)
export const quickBorrowDevice = async (deviceName: string) => {
  const res = await axios.post(`${BORROW_API_URL}/quick/${deviceName}`, {}, authHeader());
  return res.data;
};

// 🛠️ Cập nhật nội dung yêu cầu mượn (mô tả, thời gian,...)
export const updateBorrowRequest = async (id: string, updatedData: object) => {
  try {
    const res = await axios.put(`${BORROW_API_URL}/${id}`, updatedData, authHeader());
    return res.data;
  } catch (error) {
    console.error('Cập nhật yêu cầu mượn thất bại', error);
    throw new Error('Không thể cập nhật yêu cầu mượn. Vui lòng thử lại.');
  }
};

// 🔄 Cập nhật trạng thái yêu cầu (duyệt, từ chối, đã trả,...)
export const updateBorrowStatus = async (id: string, statusData: object) => {
  try {
    const res = await axios.put(`${BORROW_API_URL}/${id}/status`, statusData, authHeader());
    return res.data;
  } catch (error) {
    console.error('Cập nhật trạng thái yêu cầu thất bại', error);
    throw new Error('Không thể cập nhật trạng thái yêu cầu mượn. Vui lòng thử lại.');
  }
};

// 🔄 Cập nhật thông tin trả thiết bị
export const returnDevice = async (id: string, returnData: { returnDate: string }) => {
  try {
    const res = await axios.put(`${BORROW_API_URL}/${id}/return`, returnData, authHeader());
    return res.data;
  } catch (error) {
    console.error('Trả thiết bị thất bại', error);
    throw new Error('Không thể trả thiết bị. Vui lòng thử lại.');
  }
};

// 📝 Hủy yêu cầu mượn
export const cancelBorrowRequest = async (id: string) => {
  try {
    const res = await axios.delete(`${BORROW_API_URL}/${id}`, authHeader());
    return res.data;
  } catch (error) {
    console.error('Hủy yêu cầu mượn thất bại', error);
    throw new Error('Không thể hủy yêu cầu mượn. Vui lòng thử lại.');
  }
};
