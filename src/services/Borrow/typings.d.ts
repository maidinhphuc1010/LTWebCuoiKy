export type BorrowStatus = 'pending' | 'approved' | 'borrowing' | 'overdue' | 'returned' | 'rejected';

export interface Student {
  id: string;
  fullName: string;
  code: string;
  email: string;
}

export interface BorrowRecord {
  id: string;
  student: Student;
  deviceName: string;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: BorrowStatus;
  rejectReason?: string;
  description?: string;
}
