import axios from 'axios';

const DEVICE_API_URL = 'http://localhost:5000/api/devices';

export const fetchDevices = async () => {
  const res = await axios.get(DEVICE_API_URL);
  return res.data as Device.Info[];
};

export const createDevice = async (device: Omit<Device.Info, 'id'>) => {
  const res = await axios.post(DEVICE_API_URL, device);
  return res.data.device as Device.Info;
};

export const updateDevice = async (device: Device.Info) => {
  const res = await axios.put(`${DEVICE_API_URL}/${device.id}`, device);
  return res.data.device as Device.Info;
};

export const deleteDevice = async (deviceId: string) => {
  const res = await axios.delete(`${DEVICE_API_URL}/${deviceId}`);
  return res.data;
};
