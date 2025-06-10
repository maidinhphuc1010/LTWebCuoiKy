import { useState } from 'react';
import {
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '@/services/Admin/adminService';

export default () => {
  const [data, setData] = useState<Admin.Info[]>([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<Partial<Admin.Info>>({});
  const [isEdit, setIsEdit] = useState(false);

  const getDataAdmin = async () => {
    const res = await fetchAdmins();
    setData(res);
  };

  const handleCreate = async (payload: Admin.Info) => {
    await createAdmin(payload);
    getDataAdmin();
  };

  const handleUpdate = async (payload: Admin.Info) => {
    await updateAdmin(payload);
    getDataAdmin();
  };

  const handleDelete = async (adminId: string) => {
    await deleteAdmin(adminId);
    getDataAdmin();
  };

  return {
    data,
    visible,
    setVisible,
    current,
    setCurrent,
    isEdit,
    setIsEdit,
    getDataAdmin,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
