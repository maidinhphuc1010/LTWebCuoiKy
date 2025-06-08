import axios from '@/utils/axios';

export async function getAdmins() {
  return axios.get<Admin.Info[]>('/api/admins');
}

export async function saveAdmin(payload: Admin.Info) {
  return axios.post('/api/admins', payload);
}

export async function deleteAdmin(adminId: string) {
  return axios.delete(`/api/admins/${adminId}`);
}
