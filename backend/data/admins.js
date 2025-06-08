const adminsRaw = [
  {
    fullName: 'Nguyễn Quang Minh',
    email: 'admin1@example.com',
    phoneNumber: '0911000001',
    adminId: 'AD001',
    idCardNumber: '012345678900',
    address: 'Hà Nội',
  },
  {
    fullName: 'Trần Thị Lan',
    email: 'admin2@example.com',
    phoneNumber: '0911000002',
    adminId: 'AD002',
    idCardNumber: '012345678901',
    address: 'TP. HCM',
  },
]

// Gán employeeId = 'ADMIN' + 5 số cuối CCCD
const admins = adminsRaw.map((admin) => ({
  ...admin,
  employeeId: 'ADMIN' + admin.idCardNumber.slice(-5),
}))

export default admins
