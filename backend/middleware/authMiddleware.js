import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.id).select('-password')
            if (!user) {
                res.status(401)
                throw new Error('Không xác thực được người dùng')
            }
            req.user = user
            return next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Token không hợp lệ hoặc đã hết hạn')
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Không có token xác thực')
    }
})

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next()
    } else {
        res.status(403)
        throw new Error('Bạn không có quyền quản trị')
    }
}

export { protect, admin }