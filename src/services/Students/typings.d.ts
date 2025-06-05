declare namespace Student {
  export interface Info {
    fullName: string;
    dateOfBirth: string;
    studentId: string;
    className: string;
    email: string;
    phoneNumber: string;
    cccd: string; 
  }

  export interface ShortInfo {
    fullName: string;
    email: string;
    phoneNumber: string;
    studentId: string;
    cccd: string; // Thêm trường Số CCCD
  }
}
