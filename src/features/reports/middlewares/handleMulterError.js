import multer from 'multer'

export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send({ message: 'El archivo excede el tamaño máximo permitido' })
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).send({ message: `Solo puedes subir máximo ${process.env.UPLOAD_MAX_FILES} archivos` })
        }
    }
    next(err)
}