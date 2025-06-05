import { useState, useEffect } from 'react';
import type { BorrowRecord } from '../services/Borrow/typings';

export default function useBorrowRecords() {
  const [data, setData] = useState<BorrowRecord[]>([]);

  // Lấy dữ liệu mượn từ localStorage
  const getDataBorrow = () => {
    try {
      const raw = localStorage.getItem('borrowData');
      if (raw) {
        let parsed = JSON.parse(raw) as BorrowRecord[];

        // Kiểm tra quá hạn
        const now = new Date();
        parsed = parsed.map((record) => {
          const returnDate = new Date(record.returnDate);
          if (
            !record.actualReturnDate &&
            (record.status === 'waiting' || record.status === 'borrowing') &&
            returnDate < now
          ) {
            return { ...record, status: 'overdue' };
          }
          return record;
        });

        setData(parsed);
        localStorage.setItem('borrowData', JSON.stringify(parsed));
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Lỗi khi đọc borrowData từ localStorage:', error);
      setData([]);
    }
  };

  useEffect(() => {
    getDataBorrow(); // Fetch the borrow records when component mounts
  }, []);

  const saveData = (records: BorrowRecord[]) => {
    setData(records);
    try {
      localStorage.setItem('borrowData', JSON.stringify(records));
    } catch (e: unknown) {
      if (
        e instanceof DOMException &&
        (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      ) {
        alert('Bộ nhớ trình duyệt đã đầy. Vui lòng xóa bớt dữ liệu hoặc giảm kích thước file.');
      } else {
        console.error('Lỗi khi ghi borrowData vào localStorage:', e);
      }
    }
  };

  // Thêm bản ghi mượn mới
  const addBorrowRecord = (record: BorrowRecord) => {
    const newData = [record, ...data];
    saveData(newData);

    // Cập nhật số lượng thiết bị khi mượn
    const devices = JSON.parse(localStorage.getItem('deviceData') || '[]') as Device.Info[];
    const deviceIndex = devices.findIndex(device => device.name === record.deviceName); // Dùng deviceName thay vì deviceId

    if (deviceIndex >= 0) {
      const updatedDevices = [...devices];
      updatedDevices[deviceIndex].quantity -= 1; // Giảm số lượng thiết bị khi mượn
      localStorage.setItem('deviceData', JSON.stringify(updatedDevices));
    }
  };

  // Cập nhật bản ghi mượn
  const updateBorrowRecord = (record: BorrowRecord) => {
    const newData = data.map(item => (item.id === record.id ? record : item));
    saveData(newData);

    // Cập nhật số lượng thiết bị khi trả
    if (record.status === 'returned') {
      const devices = JSON.parse(localStorage.getItem('deviceData') || '[]') as Device.Info[];
      const deviceIndex = devices.findIndex(device => device.name === record.deviceName); // Dùng deviceName thay vì deviceId

      if (deviceIndex >= 0) {
        const updatedDevices = [...devices];
        updatedDevices[deviceIndex].quantity += 1; // Cộng số lượng thiết bị khi trả
        localStorage.setItem('deviceData', JSON.stringify(updatedDevices));
      }
    }
  };

  // Xóa bản ghi mượn
  const deleteBorrowRecord = (id: number) => {
    const newData = data.filter(item => item.id !== id);
    saveData(newData);
  };

  return {
    data,
    getDataBorrow,
    addBorrowRecord,
    updateBorrowRecord,
    deleteBorrowRecord,
  };
}
