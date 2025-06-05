import { useState, useEffect } from 'react';
import type { BorrowRecord } from '../services/Borrow/typings';
import { message } from 'antd';

export default function DeviceAdminModel() {
  const [data, setData] = useState<Device.Info[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<Device.Info | null>(null);

  // Thiết bị
  const saveToLocalStorage = (devices: Device.Info[]) => {
    localStorage.setItem('deviceData', JSON.stringify(devices));
  };

  const getDataDevice = () => {
    try {
      const dataLocal = JSON.parse(localStorage.getItem('deviceData') || '[]') as Device.Info[];
      setData(dataLocal);
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
      setData([]);
    }
  };

  useEffect(() => {
    getDataDevice(); // Fetch the device data on component mount
  }, []);

  const addDevice = (device: Omit<Device.Info, 'id'>) => {
    const existIndex = data.findIndex(
      (d) =>
        d.name === device.name &&
        d.type === device.type &&
        d.department === device.department,
    );

    const newData = [...data];

    if (existIndex >= 0) {
      newData[existIndex].quantity += device.quantity;
    } else {
      const maxId = data.length ? Math.max(...data.map((d) => d.id)) : 0;
      newData.push({ ...device, id: maxId + 1 });
    }

    setData(newData);
    saveToLocalStorage(newData);
  };

  const updateDevice = (device: Device.Info) => {
    const newData = data.map((item) => (item.id === device.id ? device : item));
    setData(newData);
    saveToLocalStorage(newData);
  };

  const deleteDevice = (id: number) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
    saveToLocalStorage(newData);
  };

  // Gửi yêu cầu mượn thiết bị
  const sendBorrowRequest = async ({
    deviceId,
    deviceName,
    status,
    returnDate,
    description,
    attachmentName,
    attachmentUrl,
  }: {
    deviceId: number;
    deviceName: string;
    status: 'waiting';
    returnDate: string;
    description?: string;
    attachmentName?: string;
    attachmentUrl?: string;
  }) => {
    const borrowData: BorrowRecord[] = JSON.parse(localStorage.getItem('borrowData') || '[]');

    // Lấy thông tin sinh viên từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // Kiểm tra nếu người dùng đã đăng nhập
    if (!currentUser) {
      message.error('Bạn cần đăng nhập để thực hiện yêu cầu mượn thiết bị.');
      return;
    }

    // Kiểm tra thời gian trả có phải lớn hơn thời gian hiện tại không
    const currentDate = new Date();
    const returnDateObj = new Date(returnDate); // Chuyển đổi returnDate thành đối tượng Date

    if (returnDateObj <= currentDate) {
      message.error('Ngày trả phải lớn hơn thời gian hiện tại.');
      return; // Nếu ngày trả không hợp lệ, không tiếp tục gửi yêu cầu
    }

    // Tạo một đối tượng sinh viên với thông tin từ currentUser
    const student = {
      id: currentUser.id,
      fullName: currentUser.fullName,
      code: currentUser.code,
    };

    // Tạo bản ghi mượn mới
    const newBorrow: BorrowRecord = {
      id: borrowData.length ? Math.max(...borrowData.map((b) => b.id)) + 1 : 1,
      deviceName,
      borrowDate: new Date().toISOString(),
      returnDate,
      status,
      description,
      attachmentName,
      attachmentUrl,
      student, // Sử dụng thông tin sinh viên từ currentUser
    };

    // Cập nhật dữ liệu mượn và lưu lại vào localStorage
    const updatedBorrowData = [...borrowData, newBorrow];
    localStorage.setItem('borrowData', JSON.stringify(updatedBorrowData));
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
    sendBorrowRequest,
  };
}
