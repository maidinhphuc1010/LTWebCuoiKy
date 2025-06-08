import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

// ✅ Kết nối MongoDB
dotenv.config()
connectDB()

const app = express()

// ✅ Middleware log khi ở dev mode
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// ✅ Middleware để parse JSON body
app.use(express.json())

// ✅ Import routes
import deviceRoutes from './routes/deviceRoutes.js'
import userRoutes from './routes/userRoutes.js'
import borrowRequestRoutes from './routes/borrowRequestRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

// ✅ Mount routes
app.use('/api/devices', deviceRoutes)
app.use('/api/users', userRoutes)
app.use('/api/borrow-requests', borrowRequestRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/admins', adminRoutes)

// ✅ Static folder for uploaded files
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// ✅ Serve frontend in production
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

// ✅ Error middleware
app.use(notFound)
app.use(errorHandler)

// ✅ Server listen
const PORT = process.env.PORT || 8000
app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
)
