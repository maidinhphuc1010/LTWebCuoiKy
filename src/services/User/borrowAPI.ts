import axios from 'axios';

export async function sendQuickBorrow(deviceName: string, returnDate: string, description?: string) {
  return axios.post(`/api/borrow/quick/${encodeURIComponent(deviceName)}`, {
    returnDate,
    description,
  });
}
