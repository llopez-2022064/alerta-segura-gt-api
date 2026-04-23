import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

export const uploadFile = (buffer, folder = process.env.CLOUDINARY_FOLDER) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (error, result) => {
                if (error) reject(error)
                else resolve(result.secure_url)
            }
        ).end(buffer)
    })
}