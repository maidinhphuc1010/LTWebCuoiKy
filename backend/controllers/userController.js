import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import crypto from 'crypto'

// Helper: kiểm tra email hợp lệ
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email)

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Email hoặc mật khẩu không đúng')
    }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Vui lòng nhập đầy đủ tên, email và mật khẩu')
    }
    if (!isValidEmail(email)) {
        res.status(400)
        throw new Error('Email không hợp lệ')
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('Email đã được sử dụng')
    }

    const user = await User.create({
        name,
        email,
        password,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Dữ liệu người dùng không hợp lệ')
    }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('Không tìm thấy người dùng')
    }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        if (req.body.email && req.body.email !== user.email) {
            if (!isValidEmail(req.body.email)) {
                res.status(400)
                throw new Error('Email không hợp lệ')
            }
            const emailExists = await User.findOne({ email: req.body.email })
            if (emailExists) {
                res.status(400)
                throw new Error('Email đã được sử dụng')
            }
            user.email = req.body.email
        }
        user.name = req.body.name || user.name
        if (req.body.password) {
            if (req.body.password.length < 6) {
                res.status(400)
                throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
            }
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        })
    } else {
        res.status(404)
        throw new Error('Không tìm thấy người dùng')
    }
})

// @desc    Đổi mật khẩu (user đã đăng nhập)
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
        res.status(400)
        throw new Error('Vui lòng nhập đầy đủ mật khẩu cũ và mới')
    }
    if (!(await user.matchPassword(oldPassword))) {
        res.status(400)
        throw new Error('Mật khẩu cũ không đúng')
    }
    if (newPassword.length < 6) {
        res.status(400)
        throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự')
    }
    user.password = newPassword
    await user.save()
    res.json({ message: 'Đổi mật khẩu thành công' })
})

// @desc    Quên mật khẩu (gửi email reset)
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        res.status(404)
        throw new Error('Không tìm thấy email này')
    }

    // Tạo token reset
    const resetToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000 // 1 giờ
    await user.save({ validateBeforeSave: false })

    // Gửi email (ở đây chỉ log ra console)
    const resetUrl = `http://localhost:5000/api/users/reset-password/${resetToken}`
    console.log(`Gửi email tới ${email}: Đặt lại mật khẩu tại ${resetUrl}`)

    res.json({ message: 'Đã gửi email hướng dẫn đặt lại mật khẩu' })
})

// @desc    Đặt lại mật khẩu
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })
    if (!user) {
        res.status(400)
        throw new Error('Token không hợp lệ hoặc đã hết hạn')
    }
    if (!req.body.password || req.body.password.length < 6) {
        res.status(400)
        throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    res.json({ message: 'Đặt lại mật khẩu thành công' })
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password')
    res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.json({ message: 'Đã xóa người dùng' })
    } else {
        res.status(404)
        throw new Error('Không tìm thấy người dùng')
    }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('Không tìm thấy người dùng')
    }
})

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        if (req.body.email && req.body.email !== user.email) {
            if (!isValidEmail(req.body.email)) {
                res.status(400)
                throw new Error('Email không hợp lệ')
            }
            const emailExists = await User.findOne({ email: req.body.email })
            if (emailExists) {
                res.status(400)
                throw new Error('Email đã được sử dụng')
            }
            user.email = req.body.email
        }
        user.name = req.body.name || user.name
        if (typeof req.body.isAdmin !== 'undefined') {
            user.isAdmin = req.body.isAdmin
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('Không tìm thấy người dùng')
    }
})

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
}
