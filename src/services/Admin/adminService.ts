import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admins';

export const fetchAdmins = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createAdmin = async (admin: Admin.Info) => {
  const res = await axios.post(`${API_URL}/create`, admin);
  return res.data;
};

export const updateAdmin = async (admin: Admin.Info) => {
  const res = await axios.put(`${API_URL}/update`, admin);
  return res.data;
};

export const deleteAdmin = async (adminId: string) => {
  const res = await axios.delete(`${API_URL}/${adminId}`);
  return res.data;
};
