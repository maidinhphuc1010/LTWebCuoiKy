import axios from '@/utils/axios'; // hoặc bạn có thể dùng axios trực tiếp

export async function getDevices() {
  return axios.get<Device.Info[]>('/api/devices');
}

export async function createDevice(device: Omit<Device.Info, 'id'>) {
  return axios.post('/api/devices', device);
}

export async function updateDevice(device: Device.Info) {
  return axios.put(`/api/devices/${device.id}`, device);
}

export async function deleteDevice(id: number) {
  return axios.delete(`/api/devices/${id}`);
}
