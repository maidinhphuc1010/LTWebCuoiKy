const adminsRaw = [
  {
    fullName: 'Nguyễn Quang Minh',
    email: 'maidinhphuc1010@gmail.com',
    phoneNumber: '0911000001',
    adminId: 'AD001',
    idCardNumber: '030205002827',
    address: 'Hà Nội',
    role: 'admin',
  },
  {
    fullName: 'Trần Thị Lan',
    email: 'admin2@example.com',
    phoneNumber: '0911000002',
    adminId: 'AD002',
    idCardNumber: '012345678901',
    address: 'TP. HCM',
    role: 'admin',
  },
]

// Gán employeeId = 'ADMIN' + 5 số cuối CCCD
const admins = adminsRaw.map((admin) => ({
  ...admin,
  employeeId: 'ADMIN' + admin.idCardNumber.slice(-5),
}))

export default admins
