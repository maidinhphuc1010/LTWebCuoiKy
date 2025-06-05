import type { BorrowStatus } from './typings';

export const statusColors: Record<BorrowStatus, string> = {
  waiting: 'blue',
  borrowing: 'orange',
  returned: 'green',
  rejected: 'red',
  overdue: 'volcano',
};

export const statusLabels: Record<BorrowStatus, string> = {
  waiting: 'Chờ duyệt',
  borrowing: 'Đang mượn',
  returned: 'Đã trả',
  rejected: 'Từ chối',
  overdue: 'Quá hạn',
};
