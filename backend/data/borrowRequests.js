const borrowRequests = [
  {
    student: {
      id: 'SV001',
      fullName: 'Nguyễn Văn A',
      code: 'B21DCCN001',
    },
    deviceName: 'Máy chiếu Sony VPL',
    borrowDate: '2025-06-01T08:00:00Z',
    returnDate: '2025-06-10T17:00:00Z',
    status: 'pending', // ✅ sửa từ 'waiting' -> 'pending'
    description: 'Mượn để trình bày đồ án tốt nghiệp',
  },
  {
    student: {
      id: 'SV002',
      fullName: 'Trần Thị B',
      code: 'B21DCCN002',
    },
    deviceName: 'Laptop Dell XPS',
    borrowDate: '2025-06-03T09:30:00Z',
    returnDate: '2025-06-12T18:00:00Z',
    status: 'borrowing',
    description: 'Mượn để thực hành đồ họa máy tính',
  },
  {
    student: {
      id: 'SV003',
      fullName: 'Lê Văn C',
      code: 'B21DCCN003',
    },
    deviceName: 'Máy in Canon LBP',
    borrowDate: '2025-05-25T10:00:00Z',
    returnDate: '2025-06-01T15:00:00Z',
    actualReturnDate: '2025-06-01T14:45:00Z',
    status: 'returned',
    description: 'Mượn để in tài liệu học tập',
  },
]

export default borrowRequests
