export type BorrowStatus = 'waiting' | 'borrowing' | 'returned' | 'rejected' | 'overdue';

export interface StudentShortInfo {
  id: number;
  fullName: string;
  code: string;
}

export interface BorrowRecord {
  id: number;
  student: StudentShortInfo;
  deviceName: string;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: BorrowStatus;
  description?: string;
  rejectReason?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}
