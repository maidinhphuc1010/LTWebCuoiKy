// Middleware xử lý 404
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

// Middleware xử lý lỗi tổng quát
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        message: err.message,
        error: process.env.NODE_ENV === 'production' ? undefined : err.name,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
}

export { notFound, errorHandler }