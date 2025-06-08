import { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  getDevices,
  createDevice as apiCreateDevice,
  updateDevice as apiUpdateDevice,
  deleteDevice as apiDeleteDevice,
} from '../services/Device/index';

export default function DeviceAdminModel() {
  const [data, setData] = useState<Device.Info[]>([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [row, setRow] = useState<Device.Info | null>(null);

  const getDataDevice = async () => {
    try {
      const res = await getDevices();
      setData(res.data);
      localStorage.setItem('deviceData', JSON.stringify(res.data));
    } catch (error) {
      message.error('Không thể lấy danh sách thiết bị từ máy chủ');
      console.error(error);
    }
  };

  useEffect(() => {
    getDataDevice();
  }, []);

  const addDevice = async (device: Omit<Device.Info, 'id'>) => {
    try {
      await apiCreateDevice(device);
      message.success('Thêm thiết bị thành công');
      await getDataDevice();
    } catch (err) {
      message.error('Lỗi khi thêm thiết bị');
      console.error(err);
    }
  };

  const updateDevice = async (device: Device.Info) => {
    try {
      await apiUpdateDevice(device);
      message.success('Cập nhật thiết bị thành công');
      await getDataDevice();
    } catch (err) {
      message.error('Lỗi khi cập nhật thiết bị');
      console.error(err);
    }
  };

  const deleteDevice = async (id: number) => {
    try {
      await apiDeleteDevice(id);
      message.success('Xóa thiết bị thành công');
      await getDataDevice();
    } catch (err) {
      message.error('Lỗi khi xóa thiết bị');
      console.error(err);
    }
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
    getDataDevice,
    addDevice,
    updateDevice,
    deleteDevice,
  };
}
