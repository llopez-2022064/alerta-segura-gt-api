import multer from "multer";

const storage = multer.memoryStorage()

export const upload = multer({
    storage,
    limits: { fileSize: process.env.UPLOAD_MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        const allowed = process.env.UPLOAD_TYPES.split(',')

        if (allowed.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Formato no permitido'))
        }
    }
})  