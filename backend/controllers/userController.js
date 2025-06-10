import asyncHandler from 'express-async-handler'

// @desc    Lấy thông tin cá nhân (profile)
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(404)
    throw new Error('Không tìm thấy người dùng')
  }

  res.json({
    _id: req.user._id,
    name: req.user.fullName,
    email: req.user.email,
    role: req.user.role,
    phoneNumber: req.user.phoneNumber,
    ...(req.user.studentId && { studentId: req.user.studentId }),
    ...(req.user.idCardNumber && { idCardNumber: req.user.idCardNumber }),
  })
})
