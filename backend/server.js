import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import cors from 'cors';

// 🔗 Kết nối MongoDB
dotenv.config()
connectDB()

const app = express()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// 📝 Middleware log HTTP (chỉ khi dev)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// 🧾 Middleware đọc JSON từ body
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:8000', // hoặc true nếu chấp nhận tất cả
  credentials: true
}));

// 📦 Import routes
import deviceRoutes from './routes/deviceRoutes.js'
import userRoutes from './routes/userRoutes.js'
import borrowRequestRoutes from './routes/borrowRequestRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import statisticsRoutes from './routes/statisticsRoutes.js'

// 🔀 Mount API routes
app.use('/api/devices', deviceRoutes)
app.use('/api/users', userRoutes)
app.use('/api/borrow-requests', borrowRequestRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/admins', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/statistics', statisticsRoutes)

// 🗂 Static folder cho file upload
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// 🧱 Serve frontend (production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running...')
  })
}

// 🛑 Middleware xử lý lỗi
app.use(notFound)
app.use(errorHandler)

// 🚀 Start server (sử dụng HTTP, không cần chứng chỉ SSL)
const PORT = process.env.PORT || 8000
app.listen(
  PORT,
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
