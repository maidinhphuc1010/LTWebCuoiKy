import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Tuấn Phong',
        email: 'mrphong2k5@gmail.com',
        password: bcrypt.hashSync('1234567', 10),
        isAdmin: true,
    },
    {
        name: 'Phong Tuấn',
        email: 'tencrush2k5@gmail.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Lê Hoa',
        email: 'hoale@student.com',
        password: bcrypt.hashSync('123456', 10),
    },
]

export default users