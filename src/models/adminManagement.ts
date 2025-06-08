import { useState, useEffect } from 'react';
import {
  getAdmins,
  saveAdmin as apiSaveAdmin,
  deleteAdmin as apiDeleteAdmin,
} from '@/services/admin';

export default function adminManagement() {
  const [data, setData] = useState<Admin.Info[]>([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [row, setRow] = useState<Admin.Info | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveToLocalStorage = (admins: Admin.Info[]) => {
    localStorage.setItem('adminData', JSON.stringify(admins));
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAdmins();
      setData(res.data);
      saveToLocalStorage(res.data);
    } catch (err) {
      setError('Không thể lấy danh sách admin');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(); // ✅ gọi đúng trong hook Umi
  }, []);

  const save = async (admin: Admin.Info) => {
    try {
      await apiSaveAdmin(admin);
      await fetchAdmins();
    } catch (err) {
      setError('Lỗi khi lưu admin');
      console.error(err);
    }
  };

  const remove = async (adminId: string) => {
    try {
      await apiDeleteAdmin(adminId);
      await fetchAdmins();
    } catch (err) {
      setError('Lỗi khi xoá admin');
      console.error(err);
    }
  };

  const getAdminData = async () => {
    await fetchAdmins();
  };

  const deleteAdmin = async (adminId: string) => {
    await remove(adminId);
  };

  const addAdmin = (admin: Admin.Info) => {
    const newData = [...data, admin];
    setData(newData);
    saveToLocalStorage(newData);
  };

  const updateAdmin = (admin: Admin.Info) => {
    const newData = data.map((item) =>
      item.adminId === admin.adminId ? admin : item
    );
    setData(newData);
    saveToLocalStorage(newData);
  };

  return {
    data,
    visible,
    setVisible,
    isEdit,
    setIsEdit,
    row,
    setRow,
    loading,
    error,
    fetchAdmins,
    getAdminData,
    save,
    deleteAdmin,
    addAdmin,
    updateAdmin,
  };
}
