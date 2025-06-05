import { useState } from 'react';

// Kiểu Admin.Info đã được khai báo trong typings.d.ts
export default function adminManagementModel() {
  const [data, setData] = useState<Admin.Info[]>([]); // Dữ liệu admin
  const [visible, setVisible] = useState<boolean>(false); // Trạng thái của modal
  const [isEdit, setIsEdit] = useState<boolean>(false); // Trạng thái chỉnh sửa
  const [row, setRow] = useState<Admin.Info | null>(null); // Dữ liệu row đang chỉnh sửa

  // Lưu dữ liệu vào localStorage
  const saveToLocalStorage = (admins: Admin.Info[]) => {
    localStorage.setItem('adminData', JSON.stringify(admins));
  };

  // Lấy dữ liệu từ localStorage
  const getAdminData = () => {
    try {
      const dataLocal = JSON.parse(localStorage.getItem('adminData') || '[]') as Admin.Info[];
      setData(dataLocal);
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
      setData([]); // Nếu có lỗi, đặt lại dữ liệu thành mảng trống
    }
  };

  // Thêm admin
  const addAdmin = (admin: Admin.Info) => {
    const newData = [...data, admin]; // Thêm admin mới vào dữ liệu
    setData(newData);
    saveToLocalStorage(newData);
  };

  // Cập nhật admin
  const updateAdmin = (admin: Admin.Info) => {
    const newData = data.map((item) => (item.adminId === admin.adminId ? admin : item)); // Cập nhật thông tin admin
    setData(newData);
    saveToLocalStorage(newData);
  };

  // Xóa admin
  const deleteAdmin = (adminId: string) => {
    const newData = data.filter((item) => item.adminId !== adminId); // Xóa admin theo adminId
    setData(newData);
    saveToLocalStorage(newData);
  };

  return {
    data,
    visible,
    setVisible,
    row,
    setRow,
    isEdit,
    setIsEdit,
    setData,
    getAdminData,
    addAdmin,
    updateAdmin,
    deleteAdmin,
  };
}
