import { useState } from 'react';
import {
  fetchDevices,
  createDevice,
  updateDevice as updateDeviceApi,
  deleteDevice as deleteDeviceApi,
} from '@/services/Device/deviceService';

export default () => {
  const [data, setData] = useState<Device.Info[]>([]);
  const [row, setRow] = useState<Device.Info | null>(null);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const getDataDevice = async () => {
    const res = await fetchDevices();
    setData(res);
  };

  const addDevice = async (device: Omit<Device.Info, 'id'>) => {
    await createDevice(device);
    await getDataDevice();
  };

  const updateDevice = async (device: Device.Info) => {
    await updateDeviceApi(device);
    await getDataDevice();
  };

  const deleteDevice = async (id: string) => {
    await deleteDeviceApi(id);
    await getDataDevice();
  };

  return {
    data,
    row,
    setRow,
    visible,
    setVisible,
    isEdit,
    setIsEdit,
    getDataDevice,
    addDevice,
    updateDevice,
    deleteDevice,
  };
};
