import { useState } from 'react';
import { sendQuickBorrow } from '../services/Borrow/borrowAPI';
import { message } from 'antd';

export default function useBorrowDevice(refetchDevices: () => void) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleQuickBorrow = async (deviceName: string, values: { returnDate: string; description?: string }) => {
    setLoadingId(deviceName);
    try {
      await sendQuickBorrow(deviceName, values.returnDate, values.description);
      message.success('Yêu cầu mượn đã gửi!');
      refetchDevices();
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi gửi yêu cầu');
      throw err;
    } finally {
      setLoadingId(null);
    }
  };

  return { handleQuickBorrow, loadingId };
}
