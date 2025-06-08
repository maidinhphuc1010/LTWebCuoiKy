import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        )
    },
})

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extName = filetypes.test(
        path.extname(file.originalname).toLocaleLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)
    if (extName && mimetype) {
        return cb(null, true)
    } else {
        cb('Chỉ cho phép upload ảnh!')
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
})

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Không có file được upload' })
    }
    res.json({ url: `/${req.file.path}` })
})

export default router
